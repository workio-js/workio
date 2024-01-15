import { AM_I_NODE } from "./AM_I_NODE";
import { getScriptURL } from "./getScriptURL";

export class WorkioInstance {

	constructor(workerFn, config, constructorArgs) {

		const workerInstance = new Worker(getScriptURL(`
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

				self.postMessage({ prepareMethod: Object.keys(publicFunctionInterface), sudo })
		
				self.${AM_I_NODE? "on" : "addEventListener"}("message", ({ data }) => {
					if("task" in data) {
						self.postMessage({ returnValue: publicFunctionInterface[data.task](...data.args) })
					}
				}, { passive: true });

			})()
		`), { type: "module" });

		const taskIdPool = {}; // キーは整数値

		workerInstance.postMessage({ constructorArgs });

		let sudo = null;

		workerInstance[AM_I_NODE? "on" : "addEventListener"]("message", ({ data }) => {
			if("sudo" in data) {
				if(sudo === null) {
					sudo = data.sudo;
				}
				if(sudo === data.sudo) {
					if(data.close) {
						workerInstance.terminate();
						return;
					}
					if("prepareMethod" in data) {
						data.prepareMethod.forEach(index => {
							this[index] = function() {
								return new Promise((resolve, reject) => {
									workerInstance.postMessage({ task: index, args: arguments })
								})
							}
						})
					}
				}
			}
		}, { passive: true });

	}
}