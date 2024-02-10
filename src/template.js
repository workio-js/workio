export async function workerTemp() {
	import.meta.url = '\0base\0';

	let runtimeKey = '\0runtimeKey\0',
		sudoKey = '\0sudoKey\0',
		publicFunctionInterface = {};

	// if (runtimeKey === 'node') {
	// 	const { parentPort } = require('node:worker_threads');
	// 	Object.assign(self, {
	// 		postMessage: parentPort.postMessage,
	// 	});
	// }

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

	self.addEventListener('message', ({ data }) => {
		if (data.sudoKey === sudoKey) {
			/**
			 * 0: init
			 * 1: exec
			 * 2: func
			 */
			({
				0({ initArgs }) {
					Object.assign(
						publicFunctionInterface,
						(function () {
							let runtimeKey = undefined,
								sudoKey = undefined,
								publicFunctionInterface = undefined,
								pendingTask = undefined,
								processTask = undefined,
								initialized = undefined;

							runtimeKey;
							sudoKey;
							publicFunctionInterface;
							pendingTask;
							processTask;
							initialized;

							return ('\0workerFn\0')(...initArgs);
						})(),
					);
					self.postMessage({
						code: 0,
						sudoKey,
						methodList: Object.keys(publicFunctionInterface),
					});
				},

				async 1({ methodName, workerArgs, taskId }) {
					if (!(methodName in publicFunctionInterface)) {
						self.postMessage({
							code: 3,
							taskId,

							sudoKey,
						});
						return;
					}
					((returnValue) => {
						if (returnValue === self.env.op_close) {
							self.postMessage({
								code: 4,
								taskId,

								sudoKey,
							});
							return;
						}
						self.postMessage(
							{
								code: 2,
								returnValue,
								taskId,

								sudoKey,
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
					})(await publicFunctionInterface[methodName](...workerArgs));
				},
			})[data.code](data);
		}
	}, { passive: true });
}
