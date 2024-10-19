const publishedWorkioInstance = new WeakMap();

export const Workio = Object.assign(async (src, base) => {

	const
		{ port1: port, port2 } = new MessageChannel(),
		worker = new Worker(import.meta.resolve("./new-template.js"), { type: "module" }),
		uuidBase = new Uint32Array(1),
		resolverPool = {},
		registerResolver = (resolver) => {
			let uuidBuf;
			while((uuidBuf = crypto.getRandomValues(uuidBase)[0]) in resolverPool) {/** */};
			resolverPool[uuidBuf] = resolver;
			return uuidBuf;
		},
		initUuid = crypto.getRandomValues(uuidBase)[0]
	;

	src = base ? new URL(src, base).href : src;

	worker.postMessage({ src, port: port2 }, [port2]);
	port.postMessage({ type: "init", uuid: initUuid });

	port.onmessage = ({ data: { type, body, uuid } }) => {
		switch(type) {
			case "return": {
				resolverPool[uuid]?.(body);
				break;
			}
		}
	};

	const publishRequest = function (...args) {
		const { method } = this;
		return new Promise(resolve => port.postMessage({
			type: "call",
			body: { method, args },
			uuid: registerResolver(resolve)
		}))
	}

	await new Promise(resolve => worker.onmessage = ({ data: { type, uuid } }) => {
		if(type !== "init" || uuid !== initUuid) return;
		delete worker.onmessage;
		resolve();
	});

	const baseProxy = new Proxy({}, {
		get(_, method) {
			if(method == "then") return;
			return publishRequest.bind({ method })
		}
	});

	publishedWorkioInstance.set(baseProxy, worker);
	return baseProxy;

}, {
	terminate(workioInstance) {
		publishedWorkioInstance.get(workioInstance)?.terminate();
	}
})