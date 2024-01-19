import { getScriptURL } from "./utils/getScriptURL.js";
import { TaskPool } from "./core/TaskPool.js";
import { runtimeKey } from "./utils/getRuntimeKey.js";

export class WorkioInstance {

	constructor({ workerFn, constructorConfig, constructorArgs }) {

		const workerInstance = new Worker(getScriptURL(`
			(async () => {

				class WorkioOp {
					constructor() { }
				}

				const ENV = {
					OP_CLOSE: new WorkioOp()
				}

				self.close = function() {
					return ENV.OP_CLOSE
				};
					
				let sudo = crypto.randomUUID();
			
				self.postMessage({ sudo });

				const publicFunctionInterface = {};
			
				self.${runtimeKey === "node"? "on" : "addEventListener"}("message", async ({ data }) => {
					if(data.constructorArgs) {
						let sudo = undefined;
						Object.assign(publicFunctionInterface, await (${workerFn.toString()})(...data.constructorArgs));
						for(const index in publicFunctionInterface) {
							if(!(publicFunctionInterface[index] instanceof Function)) {
								delete publicFunctionInterface[index]
							}
						};
					};
					if("task" in data) {
						if(data.task in publicFunctionInterface) {
							const returnValue = await publicFunctionInterface[data.task](...data.args);
							self.postMessage({
								sudo,
								returnValue,
								taskId: data.taskId,
								close: returnValue === ENV.OP_CLOSE,
							})
						} else {
							self.postMessage({ methodNotFound: true, taskId: data.taskId, sudo })
						}
					}
				}, { passive: true });
			
			})()
		`), { type: "module" });

		const personalTaskPool = new TaskPool();

		let sudo = null;
		
		workerInstance.postMessage({ constructorArgs: [...constructorArgs] });

		workerInstance.addEventListener("message", ({ data }) => {
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
						const taskId = personalTaskPool.newTask({ resolve, reject });
						workerInstance.postMessage({ task: prop, args: [...arguments], taskId })
					})
				}
			}
		})
	}
}