type WorkioTransferable = ArrayBuffer | MessagePort | ReadableStream | WritableStream | TransformStream | AudioData | ImageBitmap | VideoFrame | OffscreenCanvas | RTCDataChannel
type WorkioInstance = { [key: string]: Function; [Symbol.dispose](): void; }

const publishedWorkioInstanceMap = new WeakMap();

export const Workio = Object.assign(
	
	async (src: string, base?: string) => {

		const
			worker = new Worker(import.meta.resolve("./temp.ts"), { type: "module" }),
			{ port1: port, port2 } = new MessageChannel(),
			uuidBase = new Uint32Array(1),
			resolverPool: { [key: number]: Function } = {},
			registerResolver = function(resolver: Function) {
				let uuidBuf;
				while((uuidBuf = crypto.getRandomValues(uuidBase)[0]) in resolverPool) {/** */};
				resolverPool[uuidBuf] = resolver;
				return uuidBuf;
			},
			publishRequest = function (...args: any[]) {
				const { method } = this || {};
				return new Promise(resolve => port.postMessage({
					type: "call",
					body: { method, args },
					uuid: registerResolver(resolve)
				}))
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
					delete resolverPool[uuid];
					break;
				}
			}
		};

		const { isDefault, methodKeys }: { isDefault: boolean, methodKeys: any } = await new Promise(resolve => worker.onmessage = ({ data: { type, body, uuid } }) => {
			if(type !== "init" || uuid !== initUuid) return;
			delete worker.onmessage;
			resolve(body);
		});

		const baseObject: WorkioInstance | Function = Object.assign(
			isDefault
				? (...args: any[]) => publishRequest.apply(null, args)
				: Object.defineProperties({}, Object.assign.apply(
					null,
					methodKeys
						.map((method: string) => ({
							[method]: {
								value(...args: any[]) {
									return publishRequest.apply({ method }, args)
								},
								configurable: false,
								enumerable: false
							}
						}))
				))
			,
			{
				[Symbol.dispose]() {
					Workio.terminate(this);
				}
			}
		);

		publishedWorkioInstanceMap.set(baseObject, worker);

		return baseObject;

	},
	{
		terminate(workioInstance: WorkioInstance): void {
			publishedWorkioInstanceMap.get(workioInstance)?.terminate();
			publishedWorkioInstanceMap.delete(workioInstance);
		},

		isWorkio(workioInstance: WorkioInstance): boolean {
			return publishedWorkioInstanceMap.has(workioInstance)
		},

		isDefault(workioInstance: WorkioInstance): boolean {
			return typeof workioInstance == "function"
		}
	}
)