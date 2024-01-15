export class TaskPool {
	constructor() {
		this.pool = {};
		this.nextId = 0;
		this.vacantId = [];
	}
	newTask({ resolve }) {
		let currentId = null
		if(this.vacantId.length) {
			currentId = this.vacantId[0]
			this.vacantId.shift()
		} else {
			currentId = this.nextId
			this.nextId++;
		}
		this.pool[currentId] = resolve

		return { id: currentId }
	}
	setResponse({ taskId, returnValue }) {
		this.pool[taskId](returnValue)
		this.pool[taskId] = undefined;
		if(taskId + 1 === this.nextId) {
			this.nextId--;
		} else {
			this.vacantId.push(taskId);
		}
	}
}