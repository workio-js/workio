const { WorkioWorker } = await import("./Worker.js");
const { WorkioFunction } = await import("./Function.js");

const { runtimeKey } = await import("./utils/getRuntimeKey.js");
const { constConfig } = await import("./utils/getConstConfig.js");

class Workio {

	/**
	 * @param { Function } workerFn Describes function which executed on worker thread.
	 * 
	 * @param { Object } [config]
	 * @param { String } [config.shared]
	 */

	constructor(workerFn, config) {

		switch(false) {

			case new.target:
				throw new Error("calling Workio constructor without new is invalid");

			case workerFn instanceof Function:
				throw new TypeError("first argument must be a type of function");

			default: {
				const
					fnTemplateString = workerFn.toString(),
					constructorConfig = constConfig(config? config : {});

				return function WorkioInitializer(...workerArgs) {
					return (new.target?
						new WorkioWorker({ fnTemplateString, workerArgs }):
						new Promise((resolve) => new WorkioFunction({ resolve, fnTemplateString, workerArgs }))
					)
				}
			}

		}



		/**
		 * as: String: "worker" "function"
		 * shared: String
		 * 
		 */

		switch(constructorConfig.as) {
			case "worker":
				return class extends WorkioWorker {
					/**
					 * @param  {...any} constructorArgs 
					 */
					constructor() {
						super({ workerFn, constructorConfig, constructorArgs: arguments })
					}
				}

			case "function":
				return new WorkioFunction(workerFn)
		}
	}

	/**
	 * @param { Object } options
	 * @param { Boolean } [options.debug]
	 * @param { Number } [options.maxFunctionPending]
	 */

	static config(options) {

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