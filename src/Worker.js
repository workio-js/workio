const { getScriptURL } = await import("./utils/getScriptURL.js");
const { TaskPool } = await import("./core/TaskPool.js");
const { runtimeKey } = await import("./utils/getRuntimeKey.js");

// const { Worker } = await import("node:worker_threads");

export class WorkioWorker {

	constructor({ workerFn, constructorConfig, constructorArgs }) {

		const workerInstance = new Worker(getScriptURL(`
			(async () => {

				class WorkioOp {
					constructor() { }
				}

				let ENV = {
					OP_CLOSE: new WorkioOp()
				};

				const self = globalThis;

				self.close = function() {
					return ENV.OP_CLOSE
				};

				const sudo = crypto.randomUUID();
			
				self.postMessage({ sudo });

				self.window = self;

				self.env = {
					get type() {
						return "function"
					}
				};

				// Object.defineProperties(self.env, {
				// 	type: {
				// 		value: 
				// 	}
				// })
			
				self.${runtimeKey === "node"? "on" : "addEventListener"}("message", async ({ data }) => {
					if(data.constructorArgs) {
						let sudo = undefined;

						Object.assign(self, await (${workerFn.toString()})(...data.constructorArgs));

						// for(const index in publicFunctionInterface) {
						// 	if(!(publicFunctionInterface[index] instanceof Function)) {
						// 		delete publicFunctionInterface[index]
						// 	}
						// };
					};
					if("task" in data) {
						if(data.task in self) {
							const returnValue = await self[data.task](...data.args);
							self.postMessage({
								sudo,
								returnValue,
								taskId: data.taskId,
								close: returnValue === ENV.OP_CLOSE,
							})
						} else {
							self.postMessage({
								sudo,
								methodNotFound: true,
								taskId: data.taskId,
							})
						}
					}
				}, { passive: true });
			
			})()
		`), { type: "module", eval: true });

		const personalTaskPool = new TaskPool();

		let sudo = null;
		
		workerInstance.postMessage({ constructorArgs: [...constructorArgs] });

		workerInstance[(runtimeKey === "node")? "on" : "addEventListener"]("message", ({ data }) => {
			if(data.sudo) {
				switch(sudo) {
					case null:
						sudo = data.sudo
						break;
					case data.sudo:
						if("returnValue" in data) {
							personalTaskPool.setResponse(data) // { taskId, returnValue }
							if(data.close === true) {
								workerInstance.terminate()
							}
						}
						if(data.methodNotFound) {
							personalTaskPool.rejectResponse(data)
						}
						break;
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