async function h(){import.meta.url='\0base\0';let u='\0runtimeKey\0',e='\0sudoKey\0',t={},c=async function(){let r,s,i,n;return await'\0workerFn\0'(...arguments[0])};class f{constructor(){}}Object.defineProperties(self,{env:{value:Object.defineProperties({},{type:{value:'function',writable:!1},op_close:{value:new f,writable:!1}}),writable:!1}}),Object.assign(self,{window:self,close(){return self.env.op_close},fetch:u==='other'?function(r){return function(){return u==='other'&&(arguments[0]=new URL(arguments[0],import.meta.url)),r.apply(this,arguments)}}(self.fetch):self.fetch}),self.addEventListener('message',function({data:r}){r.sudoKey===e&&{async 0({initArgs:s}){Object.assign(t,await c(s)),self.postMessage({code:0,sudoKey:e,methodList:Object.keys(t)})},async 1({methodName:s,workerArgs:i,taskId:n}){if(!(s in t)){self.postMessage({code:3,taskId:n,sudoKey:e});return}(function(o){if(o===self.env.op_close){self.postMessage({code:4,taskId:n,sudoKey:e});return}self.postMessage({code:2,returnValue:o,taskId:n,sudoKey:e},o instanceof(ArrayBuffer||MessagePort||ReadableStream||WritableStream||TransformStream||AudioData||ImageBitmap||VideoFrame||OffscreenCanvas||RTCDataChannel)?[o]:null)})(await t[s](...i))},async 2({initArgs:s,taskId:i}){self.postMessage({taskId:i,returnValue:await c(s),sudoKey:e})}}[r.code](r)},{passive:!0})}function y(){return btoa(String.fromCharCode.apply(null,crypto.getRandomValues(new Uint8Array(64))))}var m=globalThis?.process?.release?.name==='node'?'node':globalThis?.Deno!==void 0?'deno':globalThis?.Bun!==void 0?'bun':globalThis?.fastly!==void 0?'fastly':globalThis?.__lagon__!==void 0?'lagon':globalThis?.WebSocketPair instanceof Function?'workerd':globalThis?.EdgeRuntime instanceof String?'edge-light':'other';var g=class{constructor(){this.pool={},this.nextId=0n}push({resolveExec:e,rejectExec:t}){let c=this.nextId;return this.pool[this.nextId]={resolveExec:e,rejectExec:t},this.nextId++,c}resolve({taskId:e,returnValue:t}){this.pool[e].resolveExec(t),delete this.pool[e]}reject({taskId:e}){this.pool[e].rejectExec('Method not found'),delete this.pool[e]}};var j=class{constructor(e){if(!(e instanceof Function))return;let t=y(),c=URL.createObjectURL(new Blob([`(${h.toString().replace(/\\0sudoKey\\0/,t).replace(/\\0runtimeKey\\0/,m).replace(/'\\0base\\0'/,m==='other'?`'${window.location.href}'`:'undefined').replace(/'\\0workerFn\\0'/,`(${e.toString()})`)})()`],{type:'application/javascript'}));return function(...f){let r=!!new.target;return new Promise(function(s,i){let n=new Worker(c,{type:'module',eval:!0});if(r){let o=new g,d={};n.postMessage({code:0,initArgs:f,sudoKey:t}),n.addEventListener('message',function({data:p}){p.sudoKey===t&&{0({methodList:a}){a.forEach(function(l){d[l]=function(...b){return new Promise(function(w,v){n.postMessage({code:1,methodName:l,workerArgs:b,taskId:o.push({resolveExec:w,rejectExec:v}),sudoKey:t})})}}),s(d)},1(){i('Failed to initialization')},2({returnValue:a,taskId:l}){o.resolve({returnValue:a,taskId:l})},3({taskId:a}){o.reject({taskId:a})},4({taskId:a}){o.resolve({taskId:a}),n.terminate();for(let l in d)delete d[l]}}[p.code](p)},{passive:!0})}else n.postMessage({code:2,initArgs:f,sudoKey:t}),n.addEventListener('message',function({data:o}){o.sudoKey===t&&(s(o.returnValue),n.terminate())},{passive:!0})})}}};export{j as Workio};
