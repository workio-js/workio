import * as Util from "./util/lib.js";
import { AM_I_NODE } from "./constants/lib.js";
import { WorkioWorker } from "./worker.js"

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
		switch(config.type) {
			case Worker:
			case undefined:
				return;

			case Function:
				return 
			
			case Object:
				return
		}

		return class {
			constructor(...workerConstArgs) {
				this.workerInstance = new Worker(Util.createScriptURL(`
					(async () => {
						
						self.${AM_I_NODE? "on" : "addEventListener"}("message", event => {
					
						}, { passive: true });
					
						const publicFunctionInterface = await (${workerFn.toString()})()
					
						self.postMessage(JSON.stringify({
					
						}))
					})()
				`));

				workerInstance.postMessage({
					constructorArgs: workerConstArgs
				})

				workerInstance[AM_I_NODE? "on" : "addEventListener"]("message", event => {

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