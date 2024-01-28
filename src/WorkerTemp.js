export async function workerTemp() {

	class WorkioOp {
		constructor() { }
	}

	class WorkioPort {
		constructor() {

		}
	}

	class Op extends Promise {
		constructor({ taskId }) { 
			super((resolve, reject) => Object.assign(this, { promises: { resolve, reject } }, arguments));
			self.postMessage()
		}
	}

	Object.defineProperties(self, {
		env: {
			value: Object.defineProperties({}, {
				type: {
					value: "function",
					writable: false,
				},
				op_close: {
					value: new WorkioOp(),
					writable: false,
				},
			}),
			writable: false,
		},
	});

	Object.assign(self, {

		window: self,

		close: () => self.env.op_close,

		// fetch: ((superFn) => function() {
		// 	arguments[0] = new URL(arguments[0], import.meta.url)
		// 	return superFn.apply(this, arguments);
		// })(self.fetch),

	});

	
	let
		sudoKey = "\0sudoKey\0",
		publicFunctionInterface = {};

	import.meta.url = "\0base\0";

	// self.fetch = ((superFn) => function() {
	// 	arguments[0] = new URL(arguments[0], import.meta.url)
	// 	return superFn.apply(this, arguments);
	// })(self.fetch);

	self.addEventListener("message", async ({ data }) => {
		if(data.workerArgs) {
			Object.assign(publicFunctionInterface, await (async function() {
				let
					sudoKey = undefined,
					publicFunctionInterface = undefined;

				sudoKey;
				publicFunctionInterface;

				return await ("\0workerFn\0")(...data.workerArgs);
			})());

			self.postMessage({ pFIIndex: Object.keys(publicFunctionInterface), sudoKey })
		};
		if("task" in data) {
			if(data.task in publicFunctionInterface) {
				const returnValue = await publicFunctionInterface[data.task](...data.args);
				self.postMessage({
					sudoKey,
					returnValue,
					taskId: data.taskId,
					close: (returnValue === self.env.op_close),
				},
				(returnValue instanceof (
					ArrayBuffer ||
					MessagePort ||
					ReadableStream ||
					WritableStream ||
					TransformStream ||
					AudioData ||
					ImageBitmap ||
					VideoFrame ||
					OffscreenCanvas ||
					RTCDataChannel
				)? [returnValue] : null))
			} else {
				self.postMessage({
					sudoKey,
					methodNotFound: true,
					taskId: data.taskId,
				})
			}
		}
	}, { passive: true });

}