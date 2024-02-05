export async function workerTemp() {
	import.meta.url = '\0base\0';

	let runtimeKey = '\0runtimeKey\0';

	if (runtimeKey === 'node') {
		const { parentPort } = require('node:worker_threads');
		Object.assign(self, {
			postMessage: parentPort.postMessage,
		});
	}

	class WorkioOp {
		constructor() {}
	}

	Object.defineProperties(self, {
		env: {
			value: Object.defineProperties({}, {
				type: {
					value: 'function',
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

	if ('XMLHttpRequest' in globalThis) {
		XMLHttpRequest.prototype.open = (
			(superFn) =>
				function () {
					arguments[1] = new URL(arguments[1], import.meta.url);
					return superFn.apply(this, arguments);
				}
		)(XMLHttpRequest.prototype.open);
	}

	let sudoKey = '\0sudoKey\0',
		publicFunctionInterface = {},
		initialized = false,
		pendingTask = [],
		processTask = async ({ task, args, taskId }) => {
			if (task in publicFunctionInterface) {
				((returnValue) => {
					self.postMessage(
						{
							sudoKey,
							returnValue,
							taskId,
							close: (returnValue === self.env.op_close),
						},
						returnValue instanceof (
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
							)
							? [returnValue]
							: null,
					);
				})(await publicFunctionInterface[task](...args));
			} else {
				self.postMessage({
					sudoKey,
					methodNotFound: true,
					taskId,
				});
			}
		};

	Object.assign(self, {
		window: self,

		close: () => self.env.op_close,

		fetch: runtimeKey === 'other'
			? ((superFn) =>
				function () {
					if (runtimeKey === 'other') {
						arguments[0] = new URL(arguments[0], import.meta.url);
					}
					return superFn.apply(this, arguments);
				})(self.fetch)
			: self.fetch,
	});

	self.addEventListener('message', async ({ data }) => {
		if (data.sudoKey === sudoKey) {
			if (data.workerArgs) {
				Object.assign(
					publicFunctionInterface,
					await (async function () {
						let sudoKey = undefined,
							publicFunctionInterface = undefined,
							pendingTask = undefined,
							processTask = undefined;

						sudoKey;
						publicFunctionInterface;
						pendingTask;
						processTask;

						return await ('\0workerFn\0')(...data.workerArgs);
					})(),
				);

				initialized = true;
				pendingTask.forEach((index) => processTask(index));
				pendingTask = [];
			}

			if ('task' in data) {
				initialized ? processTask(data) : pendingTask.push(data);
			}
		}
	}, { passive: true });
}