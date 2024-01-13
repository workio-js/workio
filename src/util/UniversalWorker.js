/**
 * UniversalWorker delivers wrapped Dedicated Worker works both with browser and runtime.
 */

export class UniversalWorker {
	/**
	 * @param { String } scriptURL

	 * @param { Object } eventCallbacks
	 * @param { Function } [eventCallbacks.message]
	 * @param { Function } [eventCallbacks.error]
	 * @param { Function } [eventCallbacks.messageerror]
	 * 
	 * @param { Object } [options]
	 * @param { String } [options.type]
	 * @param { String } [options.credentials]
	 * @param { String } [options.name]
	 */

	constructor(scriptURL, eventCallbacks, options) {

		this.workerInstance = new Worker(scriptURL, (options? options : null));

		for(const eventIndex in eventCallbacks) {
			this.workerInstance[AM_I_NODE? "on" : "addEventListener"](eventIndex, eventCallbacks[eventIndex], { passive: true })
		}
	}

	/**
	 * @param { * } value 
	 * @param { Array } transferList 
	 */
	postMessage(value, transferList) {
		this.workerInstance.postMessage(value, transferList)
	}

	terminate() {
		this.workerInstance.terminate();
	}
}