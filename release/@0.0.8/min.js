var S=Object.defineProperty;var a=(t,e)=>()=>(t&&(e=t(t=0)),e);var u=(t,e)=>{for(var n in e)S(t,n,{get:e[n],enumerable:!0})};var d={};u(d,{runtimeKey:()=>O});var O,l=a(()=>{O=globalThis?.process?.release?.name==="node"?"node":globalThis?.Deno!==void 0?"deno":globalThis?.Bun!==void 0?"bun":globalThis?.fastly!==void 0?"fastly":globalThis?.__lagon__!==void 0?"lagon":globalThis?.WebSocketPair instanceof Function?"workerd":globalThis?.EdgeRuntime instanceof String?"edge-light":"other"});var h={};u(h,{scriptURL:()=>M});function M(t){return U==="node"?t:URL.createObjectURL(new Blob([t],{type:"application/javascript"}))}var U,m=a(async()=>{({runtimeKey:U}=await Promise.resolve().then(()=>(l(),d)))});var w={};u(w,{TaskPool:()=>g});var g,f=a(()=>{g=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[],this.reservedResponse=[]}push({resolve:e,reject:n}){let o=null;return this.vacantId.length?(o=this.vacantId[0],this.vacantId.shift()):(o=this.nextId,this.nextId++),this.pool[o]={resolve:e,reject:n},o}setResponse({taskId:e,returnValue:n}){this.pool[e].resolve(n),this.taskGC({taskId:e})}rejectResponse({taskId:e}){this.pool[e].reject("Method not found"),this.taskGC({taskId:e})}taskGC({taskId:e}){this.pool[e]=void 0,e+1===this.nextId?this.nextId--:this.vacantId.push(e)}}});var y={};u(y,{random64:()=>_});function _(){return btoa(String.fromCharCode.apply(null,crypto.getRandomValues(new Uint8Array(64))))}var k=a(()=>{});var b={};u(b,{workerTemp:()=>A});async function A(){class t{constructor(){}}let e=globalThis;e.window=e,Object.defineProperties(e,{env:{value:Object.defineProperties({},{type:{value:"function",writable:!1},op_close:{value:new t,writable:!1}}),writable:!1}}),e.close=function(){return e.env.op_close};let n="\0sudoKey\0",o={};e.addEventListener("message",async({data:r})=>{if(r.workerArgs&&(Object.assign(o,await async function(){let s,c;return await"\0workerFn\0"(...r.workerArgs)}()),e.postMessage({pFIIndex:Object.keys(o),sudoKey:n})),"task"in r)if(r.task in o){let s=await o[r.task](...r.args);e.postMessage({sudoKey:n,returnValue:s,taskId:r.taskId,close:s===e.env.op_close},s instanceof(ArrayBuffer||MessagePort||ReadableStream||WritableStream||TransformStream||AudioData||ImageBitmap||VideoFrame||OffscreenCanvas||RTCDataChannel)?[s]:null)}else e.postMessage({sudoKey:n,methodNotFound:!0,taskId:r.taskId})},{passive:!0})}var I=a(()=>{});var j={};u(j,{WorkioWorker:()=>v});var E,B,V,D,G,v,R=a(async()=>{({scriptURL:E}=await m().then(()=>h)),{TaskPool:B}=await Promise.resolve().then(()=>(f(),w)),{runtimeKey:V}=await Promise.resolve().then(()=>(l(),d)),{random64:D}=await Promise.resolve().then(()=>(k(),y)),{workerTemp:G}=await Promise.resolve().then(()=>(I(),b)),v=class{constructor({workerFn:e,constructorConfig:n,workerArgs:o}){let r={},s=D(),c=new B,p=new Worker(E("("+G.toString().replace(/"\\0workerFn\\0"/,"("+e.toString()+")").replace(/\\0sudoKey\\0/,s)+")()"),{type:"module",eval:!0});return p.postMessage({workerArgs:o,sudoKey:s}),p[V==="node"?"on":"addEventListener"]("message",({data:i})=>{if(i.sudoKey)switch(s){case i.sudoKey:"returnValue"in i&&(c.setResponse(i),i.close===!0&&p.terminate()),i.methodNotFound&&c.rejectResponse(i),i.pFIIndex&&Object.assign(r,i.pFIIndex)}},{passive:!0}),new Proxy(this,{get(i,P,Q){return function(){return new Promise((W,L)=>{p.postMessage({task:P,args:[...arguments],taskId:c.push({resolve:W,reject:L})})})}}})}}});var x={};u(x,{WorkioFunction:()=>T});var T,K=a(async()=>{f();await m();l();T=class{constructor({resolve:e,workerFn:n,workerArgs:o}){}}});var C={};u(C,{constConfig:()=>N});function N(t){return{as:"as"in t?t.as:"worker",type:"type"in t?t.type:"web",shared:"shared"in t?t.shared:void 0,immidiate:"immidiate"in t?t.immidiate:!1}}var F=a(()=>{});var{WorkioWorker:z}=await R().then(()=>j),{WorkioFunction:q}=await K().then(()=>x),{runtimeKey:se}=await Promise.resolve().then(()=>(l(),d)),{constConfig:H}=await Promise.resolve().then(()=>(F(),C)),J=class{constructor(e,n){switch(!1){case new.target:throw new Error("calling Workio constructor without new is invalid");case e instanceof Function:throw new TypeError("first argument must be a type of function");default:{let o=H(n||{});return function(...s){return new.target?new z({workerFn:e,workerArgs:s}):new Promise(c=>new q({resolve:c,workerFn:e,workerArgs:s}))}}}}static config(e){}};export{J as Workio};
