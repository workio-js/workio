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
		if(!(workerFn instanceof Function)) {
			throw new TypeError("workerFn is not a type of function")
		};

		const constructorConfig = {}

		if(config) {
			if(config.as) {
				constructorConfig.type = config.as
			} else {
				constructorConfig.type = "worker"
			}
		} else {
			constructorConfig.type = "worker"
		}

		switch(constructorConfig.type) {
			case "worker":
				return class extends WorkioInstance {
					/**
					 * @param  {...any} constructorArgs 
					 */
					constructor(...constructorArgs) {
						super({ workerFn, config, constructorArgs })
					}

				}

			case "object":
				return new WorkioObject(workerFn, config)

			case "function":
				return new WorkioFunction(workerFn, config)
		}
	}

	/**
	 * @param { Object } options
	 * @param { Boolean } [options.debug]
	 */

	static configure(options) {

	}

};