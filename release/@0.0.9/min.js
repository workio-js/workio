var U=Object.defineProperty;var u=(s,t)=>()=>(s&&(t=s(s=0)),t);var c=(s,t)=>{for(var n in t)U(s,n,{get:t[n],enumerable:!0})};var h={};c(h,{runtimeKey:()=>S});var S,m=u(()=>{S=globalThis?.process?.release?.name==="node"?"node":globalThis?.Deno!==void 0?"deno":globalThis?.Bun!==void 0?"bun":globalThis?.fastly!==void 0?"fastly":globalThis?.__lagon__!==void 0?"lagon":globalThis?.WebSocketPair instanceof Function?"workerd":globalThis?.EdgeRuntime instanceof String?"edge-light":"other"});var k={};c(k,{scriptURL:()=>E});function E(s){return _==="node"?s:URL.createObjectURL(new Blob([s],{type:"application/javascript"}))}var _,g=u(async()=>{({runtimeKey:_}=await Promise.resolve().then(()=>(m(),h)))});var b={};c(b,{TaskPool:()=>R});var R,y=u(()=>{R=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[],this.reservedResponse=[]}push({resolve:t,reject:n}){let o=null;return this.vacantId.length?(o=this.vacantId[0],this.vacantId.shift()):(o=this.nextId,this.nextId++),this.pool[o]={resolve:t,reject:n},o}setResponse({taskId:t,returnValue:n}){this.pool[t].resolve(n),this.taskGC({taskId:t})}rejectResponse({taskId:t}){this.pool[t].reject("Method not found"),this.taskGC({taskId:t})}taskGC({taskId:t}){this.pool[t]=void 0,t+1===this.nextId?this.nextId--:this.vacantId.push(t)}}});var j={};c(j,{random64:()=>A});function A(){return btoa(String.fromCharCode.apply(null,crypto.getRandomValues(new Uint8Array(64))))}var I=u(()=>{});var v={};c(v,{workerTemp:()=>B});async function B(){class s{constructor(){}}class t{constructor(){}}class n extends Promise{constructor({taskId:r}){super((d,f)=>Object.assign(this,{promises:{resolve:d,reject:f}},arguments));self.postMessage()}}Object.defineProperties(self,{env:{value:Object.defineProperties({},{type:{value:"function",writable:!1},op_close:{value:new s,writable:!1}}),writable:!1}}),Object.assign(self,{window:self,close:()=>self.env.op_close,fetch:(e=>function(){return arguments[0]=new URL(arguments[0],import.meta.url),e.apply(this,arguments)})(self.fetch)}),"XMLHttpRequest"in globalThis&&(XMLHttpRequest.prototype.open=(e=>function(){return arguments[1]=new URL(arguments[1],import.meta.url),e.apply(this,arguments)})(XMLHttpRequest.prototype.open));let o="\0sudoKey\0",p={},i=!1,a=[],l=async function(e){if(e.task in p){let r=await p[e.task](...e.args);self.postMessage({sudoKey:o,returnValue:r,taskId:e.taskId,close:r===self.env.op_close},r instanceof(ArrayBuffer||MessagePort||ReadableStream||WritableStream||TransformStream||AudioData||ImageBitmap||VideoFrame||OffscreenCanvas||RTCDataChannel)?[r]:null)}else self.postMessage({sudoKey:o,methodNotFound:!0,taskId:e.taskId})};import.meta.url="\0base\0",self.addEventListener("message",async({data:e})=>{e.workerArgs&&(Object.assign(p,await async function(){let r,d,f,w;return await"\0workerFn\0"(...e.workerArgs)}()),i=!0,a.forEach(r=>l(r)),a=[]),"task"in e&&(i?l(e):a.push(e))},{passive:!0})}var T=u(()=>{});var x={};c(x,{WorkioWorker:()=>C});var V,q,K,D,G,C,L=u(async()=>{({scriptURL:V}=await g().then(()=>k)),{TaskPool:q}=await Promise.resolve().then(()=>(y(),b)),{runtimeKey:K}=await Promise.resolve().then(()=>(m(),h)),{random64:D}=await Promise.resolve().then(()=>(I(),j)),{workerTemp:G}=await Promise.resolve().then(()=>(T(),v)),C=class{constructor({workerFn:t,constructorConfig:n,workerArgs:o}){let p={},i=D(),a=new q,l=new Worker(V(`(${G.toString().replace(/"\\0workerFn\\0"/,"("+t.toString()+")").replace(/\\0sudoKey\\0/,i).replace(/\\0base\\0/,(()=>{switch(K){case"other":return window.location.href}})())})()`),{type:"module",eval:!0});return l.postMessage({workerArgs:o,sudoKey:i}),l[K==="node"?"on":"addEventListener"]("message",({data:e})=>{if(e.sudoKey)switch(i){case e.sudoKey:"returnValue"in e&&(a.setResponse(e),e.close===!0&&l.terminate()),e.methodNotFound&&a.rejectResponse(e),e.pFIIndex&&Object.assign(p,e.pFIIndex)}},{passive:!0}),new Proxy(this,{get(e,r,d){return function(){return new Promise((f,w)=>{l.postMessage({task:r,args:[...arguments],taskId:a.push({resolve:f,reject:w})})})}}})}}});var P={};c(P,{WorkioFunction:()=>F});var F,W=u(async()=>{y();await g();m();F=class{constructor({resolve:t,workerFn:n,workerArgs:o}){}}});var M={};c(M,{constConfig:()=>H});function H(s){return{as:"as"in s?s.as:"worker",type:"type"in s?s.type:"web",shared:"shared"in s?s.shared:void 0,immidiate:"immidiate"in s?s.immidiate:!1}}var O=u(()=>{});var{WorkioWorker:X}=await L().then(()=>x),{WorkioFunction:z}=await W().then(()=>P),{runtimeKey:oe}=await Promise.resolve().then(()=>(m(),h)),{constConfig:N}=await Promise.resolve().then(()=>(O(),M)),$=class{constructor(t,n){switch(!1){case new.target:throw new Error("calling Workio constructor without new is invalid");case t instanceof Function:throw new TypeError("first argument must be a type of function");default:{let o=N(n||{});return function(...i){return new.target?new X({workerFn:t,workerArgs:i}):new Promise(a=>new z({resolve:a,workerFn:t,workerArgs:i}))}}}}static config(t){}};export{$ as Workio};