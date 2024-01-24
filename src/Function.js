import { TaskPool } from "./core/TaskPool.js";
import { getScriptURL } from "./utils/getScriptURL.js";
import { runtimeKey } from "./utils/getRuntimeKey.js";

export class WorkioFunction {
	/**
	 * @param { Function } workerFn 
	 */
	constructor(workerFn) {
		// const scriptURL = getScriptURL(`
		// 	self.${runtimeKey === "node"? "on" : "addEventListener"}("message", ({ data }) => {

		// 	})
		// `)
		new Worker(`
			(async () => {
				self.addEventListener("message", ({ data }) => {
					self.postMessage(await (${workerFn.toString()})(...data.argObject));
					self.close();
				})
			})()
		`)
		return function() {
			const workerInstance = new Worker(scriptURL);
			return new Promise((resolve, reject) => {
				workerInstance.postMessage
			})
		}
	}
}