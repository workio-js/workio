export async function workerTemp() {
	import.meta.url = '\0base\0';

	let runtimeKey = '\0runtimeKey\0',
		sudoKey = '\0sudoKey\0',
		publicFunctionInterface = {},
		execFn = async function () {
			let runtimeKey = undefined,
				sudoKey = undefined,
				publicFunctionInterface = undefined,
				execFn = undefined;
	
			runtimeKey;
			sudoKey;
			publicFunctionInterface;
			execFn;
	
			return await ('\0workerFn\0')(...arguments[0]);
		};

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

		close() {
			return self.env.op_close
		},

		fetch: runtimeKey === 'other'
			? (function (superFn) {
				return function () {
					if (runtimeKey === 'other') {
						arguments[0] = new URL(arguments[0], import.meta.url);
					}
					return superFn.apply(this, arguments);
				}
			})(self.fetch)
			: self.fetch,
	});

	self.addEventListener('message', function ({ data }) {
		if (data.sudoKey === sudoKey) {
			/**
			 * 0: init
			 * 1: exec
			 * 2: func
			 */
			({
				async 0({ initArgs }) {
					Object.assign(
						publicFunctionInterface,
						await execFn(initArgs),
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
					(function(returnValue) {
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

				async 2({ initArgs, taskId }) {
					self.postMessage({
						taskId,
						returnValue: await execFn(initArgs),

						sudoKey,
					});
				}
			})[data.code](data);
		}
	}, { passive: true });
}
