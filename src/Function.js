import { TaskPool } from "./TaskPool.js";
import { scriptURL } from "./ScriptURL.js";
import { runtimeKey } from "./RuntimeKey.js";

export class WorkioFunction {
	/**
	 * @param { Function } workerFn 
	 */
	constructor({ resolve, workerFn, workerArgs }) {
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
	}
}