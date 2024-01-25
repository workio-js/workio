var S=Object.defineProperty;var r=(t,e)=>()=>(t&&(e=t(t=0)),e);var i=(t,e)=>{for(var s in e)S(t,s,{get:e[s],enumerable:!0})};var d={};i(d,{runtimeKey:()=>U});var U,c=r(()=>{U=globalThis?.process?.release?.name==="node"?"node":globalThis?.Deno!==void 0?"deno":globalThis?.Bun!==void 0?"bun":globalThis?.fastly!==void 0?"fastly":globalThis?.__lagon__!==void 0?"lagon":globalThis?.WebSocketPair instanceof Function?"workerd":globalThis?.EdgeRuntime instanceof String?"edge-light":"other"});var m={};i(m,{getScriptURL:()=>_});function _(t){return M==="node"?t:URL.createObjectURL(new Blob([t],{type:"application/javascript"}))}var M,p=r(async()=>{({runtimeKey:M}=await Promise.resolve().then(()=>(c(),d)))});var h={};i(h,{TaskPool:()=>w});var w,f=r(()=>{w=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[],this.reservedResponse=[]}push({resolve:e,reject:s}){let o=null;return this.vacantId.length?(o=this.vacantId[0],this.vacantId.shift()):(o=this.nextId,this.nextId++),this.pool[o]={resolve:e,reject:s},o}setResponse({taskId:e,returnValue:s}){this.pool[e].resolve(s),this.taskGC({taskId:e})}rejectResponse({taskId:e}){this.pool[e].reject("Method not found"),this.taskGC({taskId:e})}taskGC({taskId:e}){this.pool[e]=void 0,e+1===this.nextId?this.nextId--:this.vacantId.push(e)}}});var y={};i(y,{random64:()=>E});function E(){return btoa(String.fromCharCode.apply(null,crypto.getRandomValues(new Uint8Array(64))))}var b=r(()=>{});var I={};i(I,{WorkioWorker:()=>j});var V,A,k,$,j,v=r(async()=>{({getScriptURL:V}=await p().then(()=>m)),{TaskPool:A}=await Promise.resolve().then(()=>(f(),h)),{runtimeKey:k}=await Promise.resolve().then(()=>(c(),d)),{random64:$}=await Promise.resolve().then(()=>(b(),y)),j=class{constructor({workerFn:e,constructorConfig:s,workerArgs:o}){let g={},a=$(),u=new A,l=new Worker(V(`
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
						sudoKey = "${a}",
						publicFunctionInterface = {};

					self.${k==="node"?"on":"addEventListener"}("message", async ({ data }) => {
						if(data.workerArgs) {
							Object.assign(publicFunctionInterface, await (async function() {
								let
									sudoKey = undefined,
									publicFunctionInterface = undefined;

								return await (${e.toString()})(...data.workerArgs);
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
			`),{type:"module",eval:!0});return l.postMessage({workerArgs:o,sudoKey:a}),l[k==="node"?"on":"addEventListener"]("message",({data:n})=>{if(n.sudoKey)switch(a){case n.sudoKey:"returnValue"in n&&(u.setResponse(n),n.close===!0&&l.terminate()),n.methodNotFound&&u.rejectResponse(n),n.pFIIndex&&Object.assign(g,n.pFIIndex)}},{passive:!0}),new Proxy(this,{get(n,W,z){return function(){return new Promise((L,O)=>{l.postMessage({task:W,args:[...arguments],taskId:u.push({resolve:L,reject:O})})})}}})}}});var x={};i(x,{WorkioFunction:()=>R});var R,K=r(async()=>{f();await p();c();R=class{constructor({resolve:e,workerFn:s,workerArgs:o}){new Worker(`
			(async () => {
				self.addEventListener("message", ({ data }) => {
					self.postMessage(await (${s.toString()})(...data.argObject));
					self.close();
				})
			})()
		`)}}});var T={};i(T,{constConfig:()=>G});function G(t){return{as:"as"in t?t.as:"worker",type:"type"in t?t.type:"web",shared:"shared"in t?t.shared:void 0,immidiate:"immidiate"in t?t.immidiate:!1}}var C=r(()=>{});var{WorkioWorker:F}=await v().then(()=>I),{WorkioFunction:P}=await K().then(()=>x),{runtimeKey:ee}=await Promise.resolve().then(()=>(c(),d)),{constConfig:B}=await Promise.resolve().then(()=>(C(),T)),N=class{constructor(e,s){switch(!1){case new.target:throw new Error("calling Workio constructor without new is invalid");case e instanceof Function:throw new TypeError("first argument must be a type of function");default:{let o=B(s||{});return function(...a){return new.target?new F({workerFn:e,workerArgs:a}):new Promise(u=>new P({resolve:u,workerFn:e,workerArgs:a}))}}}switch(constructorConfig.as){case"worker":return class extends F{constructor(){super({workerFn:e,constructorConfig,constructorArgs:arguments})}};case"function":return new P(e)}}static config(e){}};export{N as Workio};
