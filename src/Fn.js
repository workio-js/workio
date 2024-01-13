
export class Fn {

	/**
	 * @param { Function } workerFn 
	 * @param { Object } [config]
	 * @param { Boolean } [config.async] 
	 */

	constructor(workerFn, config) {
		super()
		if(!workerFn instanceof Function) {
			throw new TypeError("workerFn is not a type of function")
		};
		const workerFnDescriber = {
			type: workerFn.constructor.name
		}

	}
}