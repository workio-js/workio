const
	{ WorkioWorker } = await import("./Worker.js"),
	{ WorkioFunction } = await import("./Function.js"),
	{ runtimeKey } = await import("./RuntimeKey.js"),
	{ constConfig } = await import("./ConstConfig.js");

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
					constructorConfig = constConfig(config? config : {});

				return function WorkioInitializer(...workerArgs) {

					return (new.target?
						new WorkioWorker({ workerFn, workerArgs }):
						new Promise((resolve) => new WorkioFunction({ resolve, workerFn, workerArgs }))
					);

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

export { Workio }