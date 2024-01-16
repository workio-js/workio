import { AM_I_NODE } from "./AM_I_NODE.js";
import { getScriptURL } from "./getScriptURL.js";
import { TaskPool } from "./TaskPool.js";
// import { Worker } from "node:worker_threads"

export class WorkioInstance {

	constructor({ workerFn, config, constructorArgs }) {

		const workerInstance = new Worker(getScriptURL(`
			(async () => {
				
				let sudo = crypto.randomUUID();

				self.postMessage({ sudo });

				self.close = function() {
					self.postMessage({ close: true, sudo })
				};

				const publicFunctionInterface = {};

				for(const index in publicFunctionInterface) {
					if(!(publicFunctionInterface[index] instanceof Function)) {
						delete publicFunctionInterface[index]
					}
				};

				self.addEventListener("message", async ({ data }) => {
					if("task" in data) {
						if(data.task in publicFunctionInterface) {
							self.postMessage({ returnValue: await publicFunctionInterface[data.task](...data.args), taskId: data.taskId, sudo })
						} else {
							self.postMessage({ methodNotFound: true, taskId: data.taskId, sudo })
						}
					}
					if(data.constructorArgs) {
						let sudo = undefined;
						Object.assign(publicFunctionInterface, await (\0workio-fn\0)(data.constructorArgs))
					}
				}, { passive: true });

			})()
		`.replace(/\t|\n/g, "").replace("\0workio-fn\0", "\n\n\n" + workerFn.toString() + "\n\n\n")), { type: "module" });

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
						const taskId = personalTaskPool.newTask({ resolve, reject });
						workerInstance.postMessage({ task: prop, args: [...arguments], taskId })
					})
				}
			}
		})
	}
}