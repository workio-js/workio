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

		fetch: ((superFn) => function() {
			arguments[0] = new URL(arguments[0], import.meta.url)
			return superFn.apply(this, arguments);
		})(self.fetch),

	});

	if("XMLHttpRequest" in globalThis) {
		XMLHttpRequest.prototype.open = ((superFn) => function() {
			arguments[1] = new URL(arguments[1], import.meta.url)
			return superFn.apply(this, arguments);
		})(XMLHttpRequest.prototype.open);
	};
	
	let
		sudoKey = "\0sudoKey\0",
		publicFunctionInterface = {},
		initialized = false,
		pendingTask = [],
		processTask = async function(data) {
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
		};

	import.meta.url = "\0base\0";

	self.addEventListener("message", async ({ data }) => {
		if(data.workerArgs) {
			Object.assign(publicFunctionInterface, await (async function() {
				let
					sudoKey = undefined,
					publicFunctionInterface = undefined,
					pendingTask = undefined,
					processTask = undefined;

				sudoKey;
				publicFunctionInterface;
				pendingTask;
				processTask;

				return await ("\0workerFn\0")(...data.workerArgs);
			})());

			initialized = true;
			pendingTask.forEach(index => processTask(index));
			pendingTask = [];
		};

		if("task" in data) {
			initialized? processTask(data) : pendingTask.push(data)
		}
	}, { passive: true });

}