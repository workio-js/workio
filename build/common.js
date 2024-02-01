var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, '__esModule', {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// build/mod.js
__markAsModule(exports);
__export(exports, {
  Workio: () => Workio
});
var import_meta = {};
var runtimeKey = globalThis?.process?.release?.name === 'node' ? 'node' : globalThis?.Deno !== void 0 ? 'deno' : globalThis?.Bun !== void 0 ? 'bun' : globalThis?.fastly !== void 0 ? 'fastly' : globalThis?.__lagon__ !== void 0 ? 'lagon' : globalThis?.WebSocketPair instanceof Function ? 'workerd' : globalThis?.EdgeRuntime instanceof String ? 'edge-light' : 'other';
function scriptURL(scriptStr) {
  return runtimeKey === 'node' ? scriptStr : URL.createObjectURL(new Blob([scriptStr], {type: 'application/javascript'}));
}
var TaskPool = class {
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
    this.pool[taskId].reject('Method not found');
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
function random64() {
  return btoa(String.fromCharCode.apply(null, crypto.getRandomValues(new Uint8Array(64))));
}
async function workerTemp() {
  import_meta.url = '\0base\0';
  class WorkioOp {
    constructor() {
    }
  }
  Object.defineProperties(self, {
    env: {
      value: Object.defineProperties({}, {
        type: {
          value: 'function',
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
  if ('XMLHttpRequest' in globalThis) {
    XMLHttpRequest.prototype.open = ((superFn) => function() {
      arguments[1] = new URL(arguments[1], import_meta.url);
      return superFn.apply(this, arguments);
    })(XMLHttpRequest.prototype.open);
  }
  let sudoKey = '\0sudoKey\0', runtimeKey2 = '\0runtimeKey\0', publicFunctionInterface = {}, initialized = false, pendingTask = [], processTask = async function({task, args, taskId}) {
    if (task in publicFunctionInterface) {
      ((returnValue) => {
        self.postMessage({
          sudoKey,
          returnValue,
          taskId,
          close: returnValue === self.env.op_close
        }, returnValue instanceof (ArrayBuffer || MessagePort || ReadableStream || WritableStream || TransformStream || AudioData || ImageBitmap || VideoFrame || OffscreenCanvas || RTCDataChannel) ? [returnValue] : null);
      })(await publicFunctionInterface[task](...args));
    } else {
      self.postMessage({
        sudoKey,
        methodNotFound: true,
        taskId
      });
    }
  };
  Object.assign(self, {
    window: self,
    close: () => self.env.op_close,
    fetch: runtimeKey2 === 'other' ? ((superFn) => function() {
      if (runtimeKey2 === 'other') {
        arguments[0] = new URL(arguments[0], import_meta.url);
      }
      return superFn.apply(this, arguments);
    })(self.fetch) : self.fetch
  });
  self.addEventListener('message', async ({data}) => {
    if (data.sudoKey === sudoKey) {
      if (data.workerArgs) {
        Object.assign(publicFunctionInterface, await async function() {
          let sudoKey2 = void 0, publicFunctionInterface2 = void 0, pendingTask2 = void 0, processTask2 = void 0;
          sudoKey2;
          publicFunctionInterface2;
          pendingTask2;
          processTask2;
          return await '\0workerFn\0'(...data.workerArgs);
        }());
        initialized = true;
        pendingTask.forEach((index) => processTask(index));
        pendingTask = [];
      }
      if ('task' in data) {
        initialized ? processTask(data) : pendingTask.push(data);
      }
    }
  }, {passive: true});
}
var WorkioWorker = class {
  constructor({workerFn, constructorConfig, workerArgs}) {
    const sudoKey = random64(), personalTaskPool = new TaskPool(), workerInstance = new Worker(scriptURL(`(${workerTemp.toString().replace(/\\0sudoKey\\0/, sudoKey).replace(/\\0runtimeKey\\0/, runtimeKey).replace(/\\0base\\0/, runtimeKey === 'other' ? window.location.href : void 0).replace(/'\\0workerFn\\0'/, '(' + workerFn.toString() + ')')})()`), {type: 'module', eval: true});
    workerInstance.postMessage({workerArgs, sudoKey});
    workerInstance[runtimeKey === 'node' ? 'on' : 'addEventListener']('message', ({data}) => {
      if (data.sudoKey) {
        switch (sudoKey) {
          case data.sudoKey:
            if ('returnValue' in data) {
              personalTaskPool.setResponse(data);
              if (data.close === true) {
                workerInstance.terminate();
              }
            }
            if (data.methodNotFound) {
              personalTaskPool.rejectResponse(data);
            }
        }
      }
    }, {passive: true});
    return new Proxy(this, {
      get(target, prop, receiver) {
        return function() {
          return new Promise((resolve, reject) => {
            workerInstance.postMessage({
              sudoKey,
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
var WorkioFunction = class {
  constructor({resolve, workerFn, workerArgs}) {
  }
};
var Workio = class {
  constructor(workerFn, config) {
    switch (false) {
      case new.target: {
        throw new Error('calling Workio constructor without new is invalid');
      }
      case workerFn instanceof Function: {
        throw new TypeError('first argument must be a type of function');
      }
      default: {
        return function WorkioInitializer(...workerArgs) {
          return new.target ? new WorkioWorker({workerFn, workerArgs}) : new Promise((resolve) => new WorkioFunction({resolve, workerFn, workerArgs}));
        };
      }
    }
  }
  static config(options) {
  }
};
