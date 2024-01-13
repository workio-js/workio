import { ScriptURL, UniversalWorker } from "./util/lib.js";
import { AM_I_NODE } from "./constants/lib.js";

export class Workio {

	/**
	 * @param { Function } workerFn Describes function which executed on worker thread.
	 * 
	 * @param { Object } [config]
	 * @param { String } [config.shared]
	 */

	constructor(workerFn, config) {
		if(!workerFn instanceof Function) {
			throw new TypeError("workerFn is not a type of function")
		};
		const compiledScriptURL = new ScriptURL(`
			(async () => {
				
				self.${AM_I_NODE? "on" : "addEventListener"}("message", event => {
			
				}, { passive: true });
			
				const publicFunctionInterface = await (\0function\0)()
			
				self.postMessage(JSON.stringify({
			
				}))
			})()
		`.replace(/\t|\n/g, "").replace("\0function\0", "\n\n\n" + scriptStr.toString()))

		return class {
			constructor(...workerConstArgs) {
				const workerInstance = new UniversalWorker(compiledScriptURL, {
					message(event) {

					}
				});

				workerInstance.postMessage({
					constructorArgs: workerConstArgs
				})

				workerInstance.addEventListener("message", event => {

				}, { passive: true });
			}
		}
	}

	static reset(WorkioWorker) {

	}

	static purge(WorkioWorker) {

	}

	/**
	 * @param { Object } options
	 * @param { Boolean } [options.debug]
	 */

	static configure(options) {

	}

};