const [src, port]: [src: string, port: MessagePort] = await new Promise(resolve => globalThis.onmessage = ({ data: { src, port } }) => {
	globalThis.onmessage = undefined;
	resolve([src, port])
});

let methods: Function[], isDefault: boolean;

port.onmessage = async ({ data: { type, body, uuid } }) => {
	switch(type) {
		case "init": {
			methods = await import(src);
			delete methods.then;
			const methodKeys = Object.keys(methods);
			isDefault = methodKeys.length == 1 && "default" in methods;
			globalThis.postMessage({ type: "init", body: { isDefault, methodKeys }, uuid });
			break;
		}
		case "call": {
			const { method, args } = body;
			port.postMessage({ type: "return", body: await methods[isDefault ? "default" : method]?.apply?.(null, args), uuid });
			break;
		}
	}
};