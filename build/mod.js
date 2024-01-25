var __defProp = Object.defineProperty;
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// src/RuntimeKey.js
var RuntimeKey_exports = {};
__export(RuntimeKey_exports, {
  runtimeKey: () => runtimeKey
});
var runtimeKey;
var init_RuntimeKey = __esm(() => {
  runtimeKey = globalThis?.process?.release?.name === "node" ? "node" : globalThis?.Deno !== void 0 ? "deno" : globalThis?.Bun !== void 0 ? "bun" : globalThis?.fastly !== void 0 ? "fastly" : globalThis?.__lagon__ !== void 0 ? "lagon" : globalThis?.WebSocketPair instanceof Function ? "workerd" : globalThis?.EdgeRuntime instanceof String ? "edge-light" : "other";
});

// src/ScriptURL.js
var ScriptURL_exports = {};
__export(ScriptURL_exports, {
  scriptURL: () => scriptURL
});
function scriptURL(scriptStr) {
  return runtimeKey2 === "node" ? scriptStr : URL.createObjectURL(new Blob([scriptStr], {type: "application/javascript"}));
}
var runtimeKey2;
var init_ScriptURL = __esm(async () => {
  ({runtimeKey: runtimeKey2} = await Promise.resolve().then(() => (init_RuntimeKey(), RuntimeKey_exports)));
});

// src/TaskPool.js
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

// src/Random64.js
var Random64_exports = {};
__export(Random64_exports, {
  random64: () => random64
});
function random64() {
  return btoa(String.fromCharCode.apply(null, crypto.getRandomValues(new Uint8Array(64))));
}
var init_Random64 = __esm(() => {
});

// src/template/Worker.js
var Worker_exports = {};
__export(Worker_exports, {
  workerTemp: () => workerTemp
});
async function workerTemp() {
  class WorkioOp {
    constructor() {
    }
  }
  const self = globalThis;
  self.window = self;
  Object.defineProperties(self, {
    env: {
      value: Object.defineProperties({}, {
        type: {
          value: "function",
          writable: false
        },
        op_close: {
          value: new WorkioOp(),
          writable: false
        }
      }),
      writable: false
    }
  });
  self.close = function() {
    return self.env.op_close;
  };
  let sudoKey = "\0sudoKey\0", publicFunctionInterface = {};
  self.addEventListener("message", async ({data}) => {
    if (data.workerArgs) {
      Object.assign(publicFunctionInterface, await async function() {
        let sudoKey2 = void 0, publicFunctionInterface2 = void 0;
        sudoKey2;
        publicFunctionInterface2;
        return await "\0workerFn\0"(...data.workerArgs);
      }());
      self.postMessage({pFIIndex: Object.keys(publicFunctionInterface), sudoKey});
    }
    ;
    if ("task" in data) {
      if (data.task in publicFunctionInterface) {
        const returnValue = await publicFunctionInterface[data.task](...data.args);
        self.postMessage({
          sudoKey,
          returnValue,
          taskId: data.taskId,
          close: returnValue === self.env.op_close
        });
      } else {
        self.postMessage({
          sudoKey,
          methodNotFound: true,
          taskId: data.taskId
        });
      }
    }
  }, {passive: true});
}
var init_Worker = __esm(() => {
});

// src/Worker.js
var Worker_exports2 = {};
__export(Worker_exports2, {
  WorkioWorker: () => WorkioWorker
});
var scriptURL2, TaskPool2, runtimeKey3, random642, workerTemp2, WorkioWorker;
var init_Worker2 = __esm(async () => {
  ({scriptURL: scriptURL2} = await init_ScriptURL().then(() => ScriptURL_exports));
  ({TaskPool: TaskPool2} = await Promise.resolve().then(() => (init_TaskPool(), TaskPool_exports)));
  ({runtimeKey: runtimeKey3} = await Promise.resolve().then(() => (init_RuntimeKey(), RuntimeKey_exports)));
  ({random64: random642} = await Promise.resolve().then(() => (init_Random64(), Random64_exports)));
  ({workerTemp: workerTemp2} = await Promise.resolve().then(() => (init_Worker(), Worker_exports)));
  WorkioWorker = class {
    constructor({workerFn, constructorConfig, workerArgs}) {
      const pFIIndex = {}, sudoKey = random642(), personalTaskPool = new TaskPool2(), workerInstance = new Worker(scriptURL2("(" + workerTemp2.toString().replace(/"\\0workerFn\\0"/, "(" + workerFn.toString() + ")").replace(/\\0sudoKey\\0/, sudoKey) + ")()"), {type: "module", eval: true});
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
  await init_ScriptURL();
  init_RuntimeKey();
  WorkioFunction = class {
    constructor({resolve, workerFn, workerArgs}) {
    }
  };
});

// src/ConstConfig.js
var ConstConfig_exports = {};
__export(ConstConfig_exports, {
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
var init_ConstConfig = __esm(() => {
});

// src/Workio.js
var {WorkioWorker: WorkioWorker2} = await init_Worker2().then(() => Worker_exports2);
var {WorkioFunction: WorkioFunction2} = await init_Function().then(() => Function_exports);
var {runtimeKey: runtimeKey4} = await Promise.resolve().then(() => (init_RuntimeKey(), RuntimeKey_exports));
var {constConfig: constConfig2} = await Promise.resolve().then(() => (init_ConstConfig(), ConstConfig_exports));
var Workio = class {
  constructor(workerFn, config) {
    switch (false) {
      case new.target:
        throw new Error("calling Workio constructor without new is invalid");
      case workerFn instanceof Function:
        throw new TypeError("first argument must be a type of function");
      default: {
        const constructorConfig = constConfig2(config ? config : {});
        return function WorkioInitializer(...workerArgs) {
          return new.target ? new WorkioWorker2({workerFn, workerArgs}) : new Promise((resolve) => new WorkioFunction2({resolve, workerFn, workerArgs}));
        };
      }
    }
  }
  static config(options) {
  }
};
export {
  Workio
};
