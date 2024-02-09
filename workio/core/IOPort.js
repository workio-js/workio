export class IOPort {
	constructor({ worker }) {
		this.worker = worker;
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
