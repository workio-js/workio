export class TaskPool {
	constructor() {
		this.pool = {};
		this.nextId = 0;
		this.vacantId = [];
		this.reservedResponse = [];
	}
	newTask({ resolve, reject }) {
		let currentId = null
		if(this.vacantId.length) {
			currentId = this.vacantId[0]
			this.vacantId.shift()
		} else {
			currentId = this.nextId
			this.nextId++;
		}
		this.pool[currentId] = { resolve, reject }

		return currentId
	}
	setResponse({ taskId, returnValue }) {
		this.pool[taskId].resolve(returnValue)
		this.taskGC({ taskId })
	}
	rejectResponse({ taskId }) {
		this.pool[taskId].reject("Method not found")
		this.taskGC({ taskId })
	}
	taskGC({ taskId }) {
		this.pool[taskId] = undefined;
		if(taskId + 1 === this.nextId) {
			this.nextId--;
		} else {
			this.vacantId.push(taskId);
		}
	}
}