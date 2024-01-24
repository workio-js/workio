const { TaskPool } = await import("./TaskPool.js")

const { runtimeKey } = await import("../utils/getRuntimeKey.js");
const { getScriptURL } = await import("../utils/getScriptURL.js");
const { random64: random32 } = await import("../utils/getRandom64.js");

const Worker = (runtimeKey === "node")? await import("node:worker_threads").Worker : globalThis.Worker;

class WorkioInstance extends Worker {
	constructor({ templateFunction, reference, isFunction, constructorArgs, type }) {

		super((templateString => (runtimeKey === "node")? templateString : getScriptURL(templateString))(`
			${(runtimeKey === "node")? `
				import { parentPort } from 'node:worker_threads';
				self.postMessage = parentPort.postMessage;
			` : ""}

			(async () => {
				class WorkioOp {
					constructor() { }
				}
	
				const ENV = {
					RUNTIME: "${runtimeKey}",
					TYPE: "${type}",
					OP_CLOSE: new WorkioOp()
				};
	
				const self = globalThis;
	
				self.close = function() {
					return ENV.OP_CLOSE
				};

				let sudoKey = null;
	
				self.window = self;
	
				${runtimeKey === "node"? "parentPort.on" : "self.addEventListener"}("message", async ({ data }) => {
					if(data.constructorArgs && data.sudoKey) {
						sudoKey = data.sudoKey;
						let sudoKey = undefined;
						Object.assign(self, await(${templateFunction.toString()})(...data.constructorArgs));
					} else if(sudoKey === data.sudoKey) {
						if(data.task) {
							if(data.task in self) {
								const returnValue = await self[data.task](...data.args);
								self.postMessage({
									sudoKey,
									returnValue,
									taskId: data.taskId,
									close: returnValue === ENV.OP_CLOSE,
								})
							} else {
								self.postMessage({
									sudoKey,
									methodNotFound: true,
									taskId: data.taskId,
								})
							}
						};
					}
				}, { passive: true });
			})()
		`), { type: "module", eval: true });

		this.taskPool = new TaskPool();

		this.sudoKey = random32();
		this.postMessage({ sudoKey: this.sudoKey, constructorArgs: [ ...constructorArgs ] });

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