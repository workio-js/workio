var __defProp = Object.defineProperty;
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// src/utils/getScriptURL.js
var getScriptURL_exports = {};
__export(getScriptURL_exports, {
  getScriptURL: () => getScriptURL
});
function getScriptURL(scriptStr) {
  return URL.createObjectURL(new Blob([scriptStr], {type: "application/javascript"}));
}
var init_getScriptURL = __esm(() => {
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
    newTask({resolve, reject}) {
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

// src/utils/getRuntimeKey.js
var getRuntimeKey_exports = {};
__export(getRuntimeKey_exports, {
  runtimeKey: () => runtimeKey
});
var runtimeKey;
var init_getRuntimeKey = __esm(() => {
  runtimeKey = globalThis?.process?.release?.name === "node" ? "node" : globalThis?.Deno !== void 0 ? "deno" : globalThis?.Bun !== void 0 ? "bun" : globalThis?.fastly !== void 0 ? "fastly" : globalThis?.__lagon__ !== void 0 ? "lagon" : globalThis?.WebSocketPair instanceof Function ? "workerd" : globalThis?.EdgeRuntime instanceof String ? "edge-light" : "other";
});

// src/Worker.js
var Worker_exports = {};
__export(Worker_exports, {
  WorkioWorker: () => WorkioWorker
});
var getScriptURL2, TaskPool2, runtimeKey2, WorkioWorker;
var init_Worker = __esm(async () => {
  ({getScriptURL: getScriptURL2} = await Promise.resolve().then(() => (init_getScriptURL(), getScriptURL_exports)));
  ({TaskPool: TaskPool2} = await Promise.resolve().then(() => (init_TaskPool(), TaskPool_exports)));
  ({runtimeKey: runtimeKey2} = await Promise.resolve().then(() => (init_getRuntimeKey(), getRuntimeKey_exports)));
  WorkioWorker = class {
    constructor({workerFn, constructorConfig, constructorArgs}) {
      const workerInstance = new Worker(getScriptURL2(`
			(async () => {

				class WorkioOp {
					constructor() { }
				}

				let ENV = {
					OP_CLOSE: new WorkioOp()
				};

				self.close = function() {
					return ENV.OP_CLOSE
				};
					
				const sudo = crypto.randomUUID();
			
				self.postMessage({ sudo });

				self.window = self;
			
				self.${runtimeKey2 === "node" ? "on" : "addEventListener"}("message", async ({ data }) => {
					if(data.constructorArgs) {
						let sudo = undefined;

						Object.assign(self, await (${workerFn.toString()})(...data.constructorArgs));

						// for(const index in publicFunctionInterface) {
						// 	if(!(publicFunctionInterface[index] instanceof Function)) {
						// 		delete publicFunctionInterface[index]
						// 	}
						// };
					};
					if("task" in data) {
						if(data.task in self) {
							const returnValue = await self[data.task](...data.args);
							self.postMessage({
								sudo,
								returnValue,
								taskId: data.taskId,
								close: returnValue === ENV.OP_CLOSE,
							})
						} else {
							self.postMessage({
								sudo,
								methodNotFound: true,
								taskId: data.taskId,
							})
						}
					}
				}, { passive: true });
			
			})()
		`), {type: "module"});
      const personalTaskPool = new TaskPool2();
      let sudo = null;
      workerInstance.postMessage({constructorArgs: [...constructorArgs]});
      workerInstance.addEventListener("message", ({data}) => {
        if (data.sudo) {
          switch (sudo) {
            case null:
              sudo = data.sudo;
              break;
            case data.sudo:
              if ("returnValue" in data) {
                personalTaskPool.setResponse(data);
                if (data.close === true) {
                  workerInstance.terminate();
                }
              }
              if (data.methodNotFound) {
                personalTaskPool.rejectResponse(data);
              }
              break;
          }
        }
      }, {passive: true});
      return new Proxy(this, {
        get(target, prop, receiver) {
          return function() {
            return new Promise((resolve, reject) => {
              const taskId = personalTaskPool.newTask({resolve, reject});
              workerInstance.postMessage({task: prop, args: [...arguments], taskId});
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
var init_Function = __esm(() => {
  init_TaskPool();
  init_getScriptURL();
  init_getRuntimeKey();
  WorkioFunction = class {
    constructor(workerFn) {
      const scriptURL = getScriptURL(`
			self.${runtimeKey === "node" ? "on" : "addEventListener"}("message", ({ data }) => {

			})
		`);
      return function() {
        const workerInstance = new Worker(scriptURL);
        return new Promise((resolve, reject) => {
          workerInstance.postMessage;
        });
      };
    }
  };
});

// src/Server.js
var Server_exports = {};
__export(Server_exports, {
  WorkioServer: () => WorkioServer
});
var WorkioServer;
var init_Server = __esm(() => {
  WorkioServer = class {
    constructor(targetFn) {
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
var {WorkioFunction: WorkioFunction2} = await Promise.resolve().then(() => (init_Function(), Function_exports));
var {WorkioServer: WorkioServer2} = await Promise.resolve().then(() => (init_Server(), Server_exports));
var {runtimeKey: runtimeKey3} = await Promise.resolve().then(() => (init_getRuntimeKey(), getRuntimeKey_exports));
var {constConfig: constConfig2} = await Promise.resolve().then(() => (init_getConstConfig(), getConstConfig_exports));
var Workio = class {
  constructor(workerFn, config) {
    if (!(workerFn instanceof Function)) {
      throw new TypeError("workerFn is not a type of function");
    }
    ;
    const constructorConfig = constConfig2(config ? config : {});
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
  static import(url) {
  }
};
if (runtimeKey3 !== "other") {
  Object.assign(Workio, {
    serve(targetFn) {
      new WorkioServer2(targetFn);
    }
  });
}
export {
  Workio
};
