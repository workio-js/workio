const [src, port] = await new Promise(resolve => globalThis.onmessage = ({ data: { src, port } }) => {
	delete globalThis.onmessage;
	resolve([src, port])
});

let methods, TYPEOF_EXPORT, IS_DEFAULT;

port.onmessage = async ({ data: { type, body, uuid } }) => {
	switch(type) {
		case "init": {
			methods = await import(src);
			IS_DEFAULT = Object.keys(methods).length == 1 && "default" in methods;
			globalThis.postMessage({ type: "init", body: { exportType: TYPEOF_EXPORT, IS_DEFAULT }, uuid });
			break;
		}
		case "call": {
			const { method, args } = body;
			port.postMessage({ type: "return", body: await methods[IS_DEFAULT ? "default" : method]?.apply?.(null, args), uuid });
			break;
		}
	}
};