import { TaskPool } from "./TaskPool.js";

const { runtimeKey } = await import("../utils/getRuntimeKey.js");
const { getScriptURL } = await import("../utils/getScriptURL.js");

const Worker = (runtimeKey === "node")? await import("node:worker_threads").Worker : globalThis.Worker;

class WorkioInstance extends Worker {
	constructor({ templateFunction, reference, isFunction }) {

		super((templateString => (runtimeKey === "node")? templateString : getScriptURL(templateString))(`
			${(runtimeKey === "node")? `
				import { parentPort } from 'node:worker_threads';

				globalThis.postMessage = parentPort.postMessage;
				EventTarget.prototype.addEventListener = EventTarget.prototype.on;
				globalThis.self = globalThis;
			` : ""}
		`), { type: "module", eval: true });

		this.taskPool = new TaskPool();

		this.sudoKey = globalThis.crypto.randomUUID();

		this.postMessage({ sudoKey: this.sudoKey });
		this[(runtimeKey === "node")? "on" : "addEventListener"]("message", ({ data }) => {
			if("sudoKey" in data && data.sudoKey === this.sudoKey) {
				
			}
		})
	}
	op({ task, args }) {
		return new Promise((resolve, reject) => {
			const taskId = this.taskPool.push({ resolve, reject });
			this.postMessage({ task, args: [...args], sudoKey: this.sudoKey, taskId })
		})
	}
}