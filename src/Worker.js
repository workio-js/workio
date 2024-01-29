const
	{ scriptURL } = await import("./util/ScriptURL.js"),
	{ TaskPool } = await import("./util/TaskPool.js"),
	{ runtimeKey } = await import("./util/RuntimeKey.js"),
	{ random64 } = await import("./util/Random64.js"),
	{ workerTemp } = await import("./template/WorkerTemp.js");

// const { Worker } = await import("node:worker_threads");

export class WorkioWorker {

	/**
	 * 
	 * @param { Object } param0 
	 * @returns { Proxy }
	 */

	constructor({ workerFn, constructorConfig, workerArgs }) {

		const
			pFIIndex = {},
			sudoKey = random64(),
			personalTaskPool = new TaskPool(),
			workerInstance = new Worker(
				scriptURL(`(${
					workerTemp.toString()
						.replace(/"\\0workerFn\\0"/, "(" + workerFn.toString() + ")")
						.replace(/\\0sudoKey\\0/, sudoKey)
						.replace(/\\0base\\0/, (() => {
							switch(runtimeKey) {
								case "other":
									return window.location.href;
							}
						})())
				})()`), { type: "module", eval: true }
			);

		workerInstance.postMessage({ workerArgs, sudoKey });

		workerInstance[(runtimeKey === "node")? "on" : "addEventListener"]("message", ({ data }) => {
			if(data.sudoKey) {
				switch(sudoKey) {
					case data.sudoKey:
						if("returnValue" in data) {
							personalTaskPool.setResponse(data) // { taskId, returnValue }
							if(data.close === true) {
								workerInstance.terminate()
							}
						}
						if(data.methodNotFound) {
							personalTaskPool.rejectResponse(data)
						}
						if(data.pFIIndex) {
							Object.assign(pFIIndex, data.pFIIndex);
						}
				}
			}
		}, { passive: true });

		return new Proxy(this, {
			get(target, prop, receiver) {
				return function() {
					return new Promise((resolve, reject) => {
						workerInstance.postMessage({
							task: prop,
							args: [...arguments],
							taskId: personalTaskPool.push({ resolve, reject })
						});
					});
				}
			}
		})
	}
}