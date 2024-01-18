import { WorkioInstance } from "./Instance.js";
import { WorkioFunction } from "./Function.js";
import { WorkioServer } from "./Server.js";

import { runtimeKey } from "./utils/getRuntimeKey.js";
import { constConfig } from "./utils/getConstConfig.js";

class Workio {

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

		const constructorConfig = constConfig(config)

		switch(constructorConfig.type) {
			case "worker":
				return class extends WorkioInstance {
					/**
					 * @param  {...any} constructorArgs 
					 */
					constructor(...constructorArgs) {
						super({ workerFn, constructorConfig, constructorArgs })
					}
				}

			case "function":
				return new WorkioFunction(workerFn, constructorConfig)
		}
	}

	/**
	 * @param { Object } options
	 * @param { Boolean } [options.debug]
	 */

	static configure(options) {

	}

	static import(url) {

	}

};

if(runtimeKey !== "other") {
	Object.assign(Workio, {
		/**
		 * @param { Object } targetFn 
		 */
		serve(targetFn) {
			new WorkioServer(targetFn)
		}
	})
}

export { Workio }

const EdgeWorker = new Workio("https://???.workers.dev", { as: "function" })