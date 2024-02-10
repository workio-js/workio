export class TaskPool {
	constructor() {
		this.pool = {};
		this.nextId = 0n;
	}
	push({ resolveExec, rejectExec }) {
		let currentId = this.nextId;
		this.pool[this.nextId] = { resolveExec, rejectExec };
		this.nextId++;

		return currentId;
	}
	resolve({ taskId, returnValue }) {
		this.pool[taskId].resolveExec(returnValue);
		delete this.pool[taskId];
	}
	reject({ taskId }) {
		this.pool[taskId].rejectExec('Method not found');
		delete this.pool[taskId];
	}
}