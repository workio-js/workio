const
	{ getScriptURL } = await import("./ScriptURL.js"),
	{ TaskPool } = await import("./TaskPool.js"),
	{ runtimeKey } = await import("./RuntimeKey.js"),
	{ random64 } = await import("./Random64.js");

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
			workerInstance = new Worker(getScriptURL(`
				(async () => {

					class WorkioOp {
						constructor() { }
					}

					const self = globalThis;
					
					self.window = self;
					
					Object.defineProperties(self, {
						env: {
							value: Object.defineProperties({}, {
								type: {
									value: "function",
									writable: false,
								},
								op_close: {
									value: new WorkioOp(),
									writable: false,
								}
							}),
							writable: false,
						},
					});

					self.close = function() {
						return self.env.op_close;
					};

					let
						sudoKey = "${sudoKey}",
						publicFunctionInterface = {};

					self.${runtimeKey === "node"? "on" : "addEventListener"}("message", async ({ data }) => {
						if(data.workerArgs) {
							Object.assign(publicFunctionInterface, await (async function() {
								let
									sudoKey = undefined,
									publicFunctionInterface = undefined;

								return await (${workerFn.toString()})(...data.workerArgs);
							})());
							self.postMessage({ pFIIndex: Object.keys(publicFunctionInterface), sudoKey })
						};
						if("task" in data) {
							if(data.task in publicFunctionInterface) {
								const returnValue = await publicFunctionInterface[data.task](...data.args);
								self.postMessage({
									sudoKey,
									returnValue,
									taskId: data.taskId,
									close: returnValue === self.env.op_close,
								})
							} else {
								self.postMessage({
									sudoKey,
									methodNotFound: true,
									taskId: data.taskId,
								})
							}
						}
					}, { passive: true });
				
				})()
			`), { type: "module", eval: true });
		
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