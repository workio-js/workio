import { AM_I_NODE } from "./AM_I_NODE.js";
import { TaskPool } from "./TaskPool.js";
import { WorkioInstance } from "./WorkioInstance.js";
import { WorkioFunction } from "./WorkioFunction.js";
import { WorkioObject } from "./WorkioObject.js";

export class Workio {

	/**
	 * @param { Function } workerFn Describes function which executed on worker thread.
	 * 
	 * @param { Object } [config]
	 * @param { String } [config.shared]
	 * @param { String } [config.as]
	 */

	constructor(workerFn, config) {
		if(!workerFn instanceof Function) {
			throw new TypeError("workerFn is not a type of function")
		};
		if(config) {
			switch(config.as) {
				case "worker":
				case undefined:
					return class extends WorkioInstance {
						/**
						 * @param  { ...any } constructorArgs 
						 */
						constructor(...constructorArgs) {
							super(workerFn, config, constructorArgs)
						}
					};
	
				case "function":
					return new WorkioFunction(workerFn, config);
				
				case "object":
					return new WorkioObject(workerFn, config);
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