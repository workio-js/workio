const { getScriptURL } = await import("./utils/getScriptURL.js");
const { TaskPool } = await import("./core/TaskPool.js");
const { runtimeKey } = await import("./utils/getRuntimeKey.js");

const { random64 } = await import("./utils/getRandom64.js")

// const { Worker } = await import("node:worker_threads");

export class WorkioWorker {

	constructor({ workerFn, constructorConfig, workerArgs }) {

		const
			sudoKey = random64(),
			personalTaskPool = new TaskPool(),
			workerInstance = new Worker(getScriptURL(`
				(async () => {

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
								}
							}),
							writable: false,
						},
					});

					self.close = function() {
						return self.env.op_close;
					};


					let
						sudoKey = "${sudoKey}",
						pFI = {};

					self.${runtimeKey === "node"? "on" : "addEventListener"}("message", async ({ data }) => {
						if(data.workerArgs) {
							Object.assign(pFI, (function () {
								let sudoKey = undefined;
								let pFI = undefined;
								return (${workerFn.toString()})(...data.workerArgs);
							})())
						};
						if("task" in data) {
							if(data.task in pFI) {
								const returnValue = await pFI[data.task](...data.args);
								self.postMessage({
									sudoKey,
									returnValue,
									taskId: data.taskId,
									close: returnValue === self.env.op_close,
								})
							} else {
								self.postMessage({
									sudoKey,
									methodNotFound: true,
									taskId: data.taskId,
								})
							}
						}
					}, { passive: true });
				
				})()
			`), { type: "module", eval: true });
		
		workerInstance.postMessage({ workerArgs: [...workerArgs] });

		workerInstance[(runtimeKey === "node")? "on" : "addEventListener"]("message", ({ data }) => {
			if(data.sudoKey) {
				switch(sudoKey) {
					case data.sudoKey:
						if("returnValue" in data) {
							personalTaskPool.setResponse(data) // { taskId, returnValue }
							if(data.close === true) {
								workerInstance.terminate()
							}
						}
						if(data.methodNotFound) {
							personalTaskPool.rejectResponse(data)
						}
				}
			}
		}, { passive: true });

		return new Proxy(this, {
			get(target, prop, receiver) {
				return function() {
					return new Promise((resolve, reject) => {
						const taskId = personalTaskPool.push({ resolve, reject });
						workerInstance.postMessage({ task: prop, args: [...arguments], taskId })
					})
				}
			}
		})
	}
}