import { AM_I_NODE } from "./AM_I_NODE.js";
import { getScriptURL } from "./getScriptURL.js";
import { TaskPool } from "./TaskPool.js";
// import { Worker } from "node:worker_threads"

export class WorkioInstance {

	constructor(workerFn, config, constructorArgs) {

		const workerInstance = new Worker(((scriptString) => getScriptURL(scriptString))(`
			(async () => {

				// init
				
				let sudo = crypto.randomUUID();

				self.postMessage({ sudo })

				self.close = function() {
					self.postMessage({ close: true, sudo })
				}

				let publicFunctionInterface = {};

				// sandboxed process
				
				{
					let sudo = undefined;
					publicFunctionInterface = await (${workerFn.toString()})();
				}

				for(const index in publicFunctionInterface) {
					if(!(publicFunctionInterface[index] instanceof Function)) {
						delete publicFunctionInterface[index]
					}
				}
		
				self.addEventListener("message", async ({ data }) => {
					if("task" in data) {
						if(data.task in publicFunctionInterface) {
							self.postMessage({ returnValue: await publicFunctionInterface[data.task](...data.args), taskId: data.taskId, sudo })
						} else {
							self.postMessage({ methodNotFound: true, taskId: data.taskId, sudo })
						}
					}
				}, { passive: true });

			})()
		`), { type: "module" });

		const personalTaskPool = new TaskPool();

		let sudo = null;
		
		workerInstance.postMessage({ constructorArgs });

		workerInstance.addEventListener("message", ({ data }) => {
			if(data.sudo) {
				switch(sudo) {
					case null:
						sudo = data.sudo
						break;
					case data.sudo:
						if(data.close) {
							workerInstance.terminate();
							return;
						}
						// if(data.prepareMethod) {
						// 	data.prepareMethod.forEach(index => {
						// 		this[index] = async function() {
						// 			return new Promise((resolve, reject) => {
						// 				const task = personalTaskPool.newTask({ resolve });
						// 				workerInstance.postMessage({ task: index, args: [...arguments], taskId: task.id })
						// 			})
						// 		}
						// 	})
						// }
						if(data.returnValue) {
							personalTaskPool.setResponse(data) // { taskId, returnValue }
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
						const task = personalTaskPool.newTask({ resolve, reject });
						workerInstance.postMessage({ task: prop, args: [...arguments], taskId: task.id })
					})
				}
			}
		})
	}
}