const { WorkioWorker } = await import('./Worker.js'),
	{ WorkioFunction } = await import('./Function.js'),
	{ runtimeKey } = await import('./util/RuntimeKey.js'),
	{ constConfig } = await import('./util/ConstConfig.js');

class Workio {
	/**
	 * @param { Function } workerFn Describes function which executed on worker thread.
	 *
	 * @param { Object } [config]
	 * @param { String } [config.shared]
	 */

	constructor(workerFn, config) {
		switch (false) {
			case new.target: {
				throw new Error('calling Workio constructor without new is invalid');
			}

			case workerFn instanceof Function: {
				throw new TypeError('first argument must be a type of function');
			}

			default: {
				return function WorkioInitializer(...workerArgs) {
					return (new.target
						? new WorkioWorker({ workerFn, workerArgs })
						: new Promise((resolve) =>
							new WorkioFunction({ resolve, workerFn, workerArgs })
						));
				};
			}
		}
	}

	/**
	 * @param { Object } options
	 * @param { Boolean } [options.debug]
	 * @param { Number } [options.maxFunctionPending]
	 */

	static config(options) {
	}
}

export { Workio };
