const [src, port] = await new Promise(resolve => globalThis.onmessage = ({ data: { src, port } }) => {
	delete globalThis.onmessage;
	resolve([src, port])
});

let methods;

await new Promise(resolve => port.onmessage = async ({ data: { type, body, uuid } }) => {
	switch(type) {
		case "init": {
			methods = await import(src);
			globalThis.postMessage({ type: "init", uuid });
			resolve()
			break;
		}
		case "call": {
			const { method, args } = body;
			port.postMessage({ type: "return", body: await methods[method]?.apply?.(null, args), uuid });
			break;
		}
	}
});