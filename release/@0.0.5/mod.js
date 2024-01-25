var __defProp = Object.defineProperty;
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// src/utils/getRuntimeKey.js
var getRuntimeKey_exports = {};
__export(getRuntimeKey_exports, {
  runtimeKey: () => runtimeKey
});
var runtimeKey;
var init_getRuntimeKey = __esm(() => {
  runtimeKey = globalThis?.process?.release?.name === "node" ? "node" : globalThis?.Deno !== void 0 ? "deno" : globalThis?.Bun !== void 0 ? "bun" : globalThis?.fastly !== void 0 ? "fastly" : globalThis?.__lagon__ !== void 0 ? "lagon" : globalThis?.WebSocketPair instanceof Function ? "workerd" : globalThis?.EdgeRuntime instanceof String ? "edge-light" : "other";
});

// src/utils/getScriptURL.js
var getScriptURL_exports = {};
__export(getScriptURL_exports, {
  getScriptURL: () => getScriptURL
});
function getScriptURL(scriptStr) {
  return runtimeKey2 === "node" ? scriptStr : URL.createObjectURL(new Blob([scriptStr], {type: "application/javascript"}));
}
var runtimeKey2;
var init_getScriptURL = __esm(async () => {
  ({runtimeKey: runtimeKey2} = await Promise.resolve().then(() => (init_getRuntimeKey(), getRuntimeKey_exports)));
});

// src/core/TaskPool.js
var TaskPool_exports = {};
__export(TaskPool_exports, {
  TaskPool: () => TaskPool
});
var TaskPool;
var init_TaskPool = __esm(() => {
  TaskPool = class {
    constructor() {
      this.pool = {};
      this.nextId = 0;
      this.vacantId = [];
      this.reservedResponse = [];
    }
    push({resolve, reject}) {
      let currentId = null;
      if (this.vacantId.length) {
        currentId = this.vacantId[0];
        this.vacantId.shift();
      } else {
        currentId = this.nextId;
        this.nextId++;
      }
      this.pool[currentId] = {resolve, reject};
      return currentId;
    }
    setResponse({taskId, returnValue}) {
      this.pool[taskId].resolve(returnValue);
      this.taskGC({taskId});
    }
    rejectResponse({taskId}) {
      this.pool[taskId].reject("Method not found");
      this.taskGC({taskId});
    }
    taskGC({taskId}) {
      this.pool[taskId] = void 0;
      if (taskId + 1 === this.nextId) {
        this.nextId--;
      } else {
        this.vacantId.push(taskId);
      }
    }
  };
});

// src/utils/getRandom64.js
var getRandom64_exports = {};
__export(getRandom64_exports, {
  random64: () => random64
});
function random64() {
  return btoa(String.fromCharCode.apply(null, crypto.getRandomValues(new Uint8Array(64))));
}
var init_getRandom64 = __esm(() => {
});

// src/Worker.js
var Worker_exports = {};
__export(Worker_exports, {
  WorkioWorker: () => WorkioWorker
});
var getScriptURL2, TaskPool2, runtimeKey3, random642, WorkioWorker;
var init_Worker = __esm(async () => {
  ({getScriptURL: getScriptURL2} = await init_getScriptURL().then(() => getScriptURL_exports));
  ({TaskPool: TaskPool2} = await Promise.resolve().then(() => (init_TaskPool(), TaskPool_exports)));
  ({runtimeKey: runtimeKey3} = await Promise.resolve().then(() => (init_getRuntimeKey(), getRuntimeKey_exports)));
  ({random64: random642} = await Promise.resolve().then(() => (init_getRandom64(), getRandom64_exports)));
  WorkioWorker = class {
    constructor({workerFn, constructorConfig: constructorConfig2, workerArgs}) {
      const pFIIndex = {}, sudoKey = random642(), personalTaskPool = new TaskPool2(), workerInstance = new Worker(getScriptURL2(`
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

					self.${runtimeKey3 === "node" ? "on" : "addEventListener"}("message", async ({ data }) => {
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
			`), {type: "module", eval: true});
      workerInstance.postMessage({workerArgs, sudoKey});
      workerInstance[runtimeKey3 === "node" ? "on" : "addEventListener"]("message", ({data}) => {
        if (data.sudoKey) {
          switch (sudoKey) {
            case data.sudoKey:
              if ("returnValue" in data) {
                personalTaskPool.setResponse(data);
                if (data.close === true) {
                  workerInstance.terminate();
                }
              }
              if (data.methodNotFound) {
                personalTaskPool.rejectResponse(data);
              }
              if (data.pFIIndex) {
                Object.assign(pFIIndex, data.pFIIndex);
              }
          }
        }
      }, {passive: true});
      return new Proxy(this, {
        get(target, prop, receiver) {
          return function() {
            return new Promise((resolve, reject) => {
              workerInstance.postMessage({
                task: prop,
                args: [...arguments],
                taskId: personalTaskPool.push({resolve, reject})
              });
            });
          };
        }
      });
    }
  };
});

// src/Function.js
var Function_exports = {};
__export(Function_exports, {
  WorkioFunction: () => WorkioFunction
});
var WorkioFunction;
var init_Function = __esm(async () => {
  init_TaskPool();
  await init_getScriptURL();
  init_getRuntimeKey();
  WorkioFunction = class {
    constructor({resolve, workerFn, workerArgs}) {
      new Worker(`
			(async () => {
				self.addEventListener("message", ({ data }) => {
					self.postMessage(await (${workerFn.toString()})(...data.argObject));
					self.close();
				})
			})()
		`);
    }
  };
});

// src/utils/getConstConfig.js
var getConstConfig_exports = {};
__export(getConstConfig_exports, {
  constConfig: () => constConfig
});
function constConfig(config) {
  return {
    as: "as" in config ? config.as : "worker",
    type: "type" in config ? config.type : "web",
    shared: "shared" in config ? config.shared : void 0,
    immidiate: "immidiate" in config ? config.immidiate : false
  };
}
var init_getConstConfig = __esm(() => {
});

// src/Workio.js
var {WorkioWorker: WorkioWorker2} = await init_Worker().then(() => Worker_exports);
var {WorkioFunction: WorkioFunction2} = await init_Function().then(() => Function_exports);
var {runtimeKey: runtimeKey4} = await Promise.resolve().then(() => (init_getRuntimeKey(), getRuntimeKey_exports));
var {constConfig: constConfig2} = await Promise.resolve().then(() => (init_getConstConfig(), getConstConfig_exports));
var Workio = class {
  constructor(workerFn, config) {
    switch (false) {
      case new.target:
        throw new Error("calling Workio constructor without new is invalid");
      case workerFn instanceof Function:
        throw new TypeError("first argument must be a type of function");
      default: {
        const constructorConfig2 = constConfig2(config ? config : {});
        return function WorkioInitializer(...workerArgs) {
          return new.target ? new WorkioWorker2({workerFn, workerArgs}) : new Promise((resolve) => new WorkioFunction2({resolve, workerFn, workerArgs}));
        };
      }
    }
    switch (constructorConfig.as) {
      case "worker":
        return class extends WorkioWorker2 {
          constructor() {
            super({workerFn, constructorConfig, constructorArgs: arguments});
          }
        };
      case "function":
        return new WorkioFunction2(workerFn);
    }
  }
  static config(options) {
  }
};
export {
  Workio
};
