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
async function workerTemp() {
  import_meta.url = '\0base\0';
  let runtimeKey2 = '\0runtimeKey\0', sudoKey = '\0sudoKey\0', publicFunctionInterface = {};
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
  self.addEventListener('message', ({data}) => {
    if (data.sudoKey === sudoKey) {
      ({
        0({initArgs}) {
          Object.assign(publicFunctionInterface, function() {
            let runtimeKey3 = void 0, sudoKey2 = void 0, publicFunctionInterface2 = void 0, pendingTask = void 0, processTask = void 0, initialized = void 0;
            runtimeKey3;
            sudoKey2;
            publicFunctionInterface2;
            pendingTask;
            processTask;
            initialized;
            return '\0workerFn\0'(...initArgs);
          }());
          self.postMessage({
            code: 0,
            sudoKey,
            methodList: Object.keys(publicFunctionInterface)
          });
        },
        async 1({methodName, workerArgs, taskId}) {
          if (!(methodName in publicFunctionInterface)) {
            self.postMessage({
              code: 3,
              taskId,
              sudoKey
            });
            return;
          }
          ((returnValue) => {
            if (returnValue === self.env.op_close) {
              self.postMessage({
                code: 6,
                taskId,
                sudoKey
              });
              return;
            }
            self.postMessage({
              code: 2,
              returnValue,
              taskId,
              sudoKey
            }, returnValue instanceof (ArrayBuffer || MessagePort || ReadableStream || WritableStream || TransformStream || AudioData || ImageBitmap || VideoFrame || OffscreenCanvas || RTCDataChannel) ? [returnValue] : null);
          })(await publicFunctionInterface[methodName](...workerArgs));
        }
      })[data.code](data);
    }
  }, {passive: true});
}
function random64() {
  return btoa(String.fromCharCode.apply(null, crypto.getRandomValues(new Uint8Array(64))));
}
var runtimeKey = globalThis?.process?.release?.name === 'node' ? 'node' : globalThis?.Deno !== void 0 ? 'deno' : globalThis?.Bun !== void 0 ? 'bun' : globalThis?.fastly !== void 0 ? 'fastly' : globalThis?.__lagon__ !== void 0 ? 'lagon' : globalThis?.WebSocketPair instanceof Function ? 'workerd' : globalThis?.EdgeRuntime instanceof String ? 'edge-light' : 'other';
var TaskPool = class {
  constructor() {
    this.pool = {};
    this.nextId = 0n;
  }
  push({resolveExec, rejectExec}) {
    let currentId = this.nextId;
    this.pool[this.nextId] = {resolveExec, rejectExec};
    this.nextId++;
    return currentId;
  }
  setResponse({taskId, returnValue}) {
    this.pool[taskId].resolveExec(returnValue);
    delete this.pool[taskId];
  }
  rejectResponse({taskId}) {
    this.pool[taskId].rejectExec('Method not found');
    delete this.pool[taskId];
  }
};
var Workio = class {
  constructor(workerFn) {
    if (!(new.target && workerFn instanceof Function))
      return void 0;
    const sudoKey = random64(), workerURL = URL.createObjectURL(new Blob([
      `(${workerTemp.toString().replace(/\\0sudoKey\\0/, sudoKey).replace(/\\0runtimeKey\\0/, runtimeKey).replace(/'\\0base\\0'/, runtimeKey === 'other' ? `'${window.location.href}'` : 'undefined').replace(/'\\0workerFn\\0'/, `(${workerFn.toString()})`)})()`
    ], {type: 'application/javascript'}));
    return function(...initArgs) {
      const isConstructed = !!new.target;
      return new Promise(function(resolveInit, rejectInit) {
        const workerInstance = new Worker(workerURL, {type: 'module', eval: true});
        if (isConstructed) {
          const taskPool = new TaskPool(), methodObject = {};
          workerInstance.postMessage({
            code: 0,
            initArgs,
            sudoKey
          });
          workerInstance.addEventListener('message', function({data}) {
            if (data.sudoKey === sudoKey) {
              ({
                0({methodList}) {
                  methodList.forEach((methodName) => {
                    methodObject[methodName] = function(...workerArgs) {
                      return new Promise(function(resolveExec, rejectExec) {
                        workerInstance.postMessage({
                          code: 1,
                          methodName,
                          workerArgs,
                          taskId: taskPool.push({
                            resolveExec,
                            rejectExec
                          }),
                          sudoKey
                        });
                      });
                    };
                  });
                  resolveInit(methodObject);
                },
                1() {
                  rejectInit('Failed to initialization');
                },
                2({returnValue, taskId}) {
                  taskPool.setResponse({returnValue, taskId});
                },
                3({taskId}) {
                  taskPool.rejectResponse(taskId);
                },
                6({taskId}) {
                  taskPool.setResponse({taskId});
                  workerInstance.terminate();
                  for (const methodObjectIndex in methodObject) {
                    delete methodObject[methodObjectIndex];
                  }
                }
              })[data.code](data);
            }
          }, {passive: true});
        } else {
          workerInstance.postMessage({
            code: 2,
            initArgs,
            sudoKey,
            isInstance: false
          });
          workerInstance.addEventListener('message', function({data}) {
            if (data.sudoKey === sudoKey) {
              if (data.initSucceed) {
                resolveInit(data.returnValue);
              } else {
                rejectInit();
              }
              workerInstance.terminate();
            }
          }, {passive: true});
        }
      });
    };
  }
};
