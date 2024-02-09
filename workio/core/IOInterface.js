export class IOInterface extends Promise {
	constructor(messagePort, callbackFn) {
		super((resolve, reject) => Object.assign(this, { resolve, reject }));
		switch (false) {
			case messagePort instanceof MessagePort:
				throw new Error('first argument is not a type of MessagePort');
			case callbackFn instanceof Function:
				throw new Error('no callback was found');
			default:
				messagePort.postMessage('');
		}
		this.isInitialized = false;
		this.beforeInitializationRequests = [];
	}
	serialize({ data }) {
	}
	initialize({ data }) {
		this.beforeInitializationRequests.forEach((data) => this.request({ data }));
		this.isInitialized = true;
	}
	request({ data }) {
		return new Promise((resolve, reject) => {
			if (!this.isInitialized) {
			}
		});
	}
}
