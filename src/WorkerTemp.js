export async function workerTemp() {

	class WorkioOp {
		constructor() { }
	}

	const self = globalThis;
	
	self.window = self;
	
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

	self.close = function() {
		return self.env.op_close;
	};

	let
		sudoKey = "\0sudoKey\0",
		publicFunctionInterface = {};

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