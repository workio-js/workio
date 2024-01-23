var W=Object.defineProperty;var r=(t,e)=>()=>(t&&(e=t(t=0)),e);var i=(t,e)=>{for(var s in e)W(t,s,{get:e[s],enumerable:!0})};var h={};i(h,{getScriptURL:()=>l});function l(t){return URL.createObjectURL(new Blob([t],{type:"application/javascript"}))}var d=r(()=>{});var w={};i(w,{TaskPool:()=>k});var k,p=r(()=>{k=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[],this.reservedResponse=[]}newTask({resolve:e,reject:s}){let o=null;return this.vacantId.length?(o=this.vacantId[0],this.vacantId.shift()):(o=this.nextId,this.nextId++),this.pool[o]={resolve:e,reject:s},o}setResponse({taskId:e,returnValue:s}){this.pool[e].resolve(s),this.taskGC({taskId:e})}rejectResponse({taskId:e}){this.pool[e].reject("Method not found"),this.taskGC({taskId:e})}taskGC({taskId:e}){this.pool[e]=void 0,e+1===this.nextId?this.nextId--:this.vacantId.push(e)}}});var f={};i(f,{runtimeKey:()=>g});var g,u=r(()=>{g=globalThis?.process?.release?.name==="node"?"node":globalThis?.Deno!==void 0?"deno":globalThis?.Bun!==void 0?"bun":globalThis?.fastly!==void 0?"fastly":globalThis?.__lagon__!==void 0?"lagon":globalThis?.WebSocketPair instanceof Function?"workerd":globalThis?.EdgeRuntime instanceof String?"edge-light":"other"});var y={};i(y,{WorkioWorker:()=>b});var K,M,V,b,j=r(async()=>{({getScriptURL:K}=await Promise.resolve().then(()=>(d(),h))),{TaskPool:M}=await Promise.resolve().then(()=>(p(),w)),{runtimeKey:V}=await Promise.resolve().then(()=>(u(),f)),b=class{constructor({workerFn:e,constructorConfig:s,constructorArgs:o}){let a=new Worker(K(`
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
			
				self.${V==="node"?"on":"addEventListener"}("message", async ({ data }) => {
					if(data.constructorArgs) {
						let sudo = undefined;

						Object.assign(self, await (${e.toString()})(...data.constructorArgs));

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
		`),{type:"module"}),c=new M,m=null;return a.postMessage({constructorArgs:[...o]}),a.addEventListener("message",({data:n})=>{if(n.sudo)switch(m){case null:m=n.sudo;break;case n.sudo:"returnValue"in n&&(c.setResponse(n),n.close===!0&&a.terminate()),n.methodNotFound&&c.rejectResponse(n);break}},{passive:!0}),new Proxy(this,{get(n,E,D){return function(){return new Promise((F,O)=>{let U=c.newTask({resolve:F,reject:O});a.postMessage({task:E,args:[...arguments],taskId:U})})}}})}}});var v={};i(v,{WorkioFunction:()=>x});var x,I=r(()=>{p();d();u();x=class{constructor(e){let s=l(`
			self.${g==="node"?"on":"addEventListener"}("message", ({ data }) => {

			})
		`);return function(){let o=new Worker(s);return new Promise((a,c)=>{o.postMessage})}}}});var R={};i(R,{WorkioServer:()=>T});var T,L=r(()=>{T=class{constructor(e){}}});var S={};i(S,{constConfig:()=>_});function _(t){return{as:"as"in t?t.as:"worker",type:"type"in t?t.type:"web",shared:"shared"in t?t.shared:void 0,immidiate:"immidiate"in t?t.immidiate:!1}}var C=r(()=>{});var{WorkioWorker:N}=await j().then(()=>y),{WorkioFunction:A}=await Promise.resolve().then(()=>(I(),v)),{WorkioServer:G}=await Promise.resolve().then(()=>(L(),R)),{runtimeKey:$}=await Promise.resolve().then(()=>(u(),f)),{constConfig:B}=await Promise.resolve().then(()=>(C(),S)),P=class{constructor(e,s){if(!(e instanceof Function))throw new TypeError("workerFn is not a type of function");let o=B(s||{});switch(o.as){case"worker":return class extends N{constructor(){super({workerFn:e,constructorConfig:o,constructorArgs:arguments})}};case"function":return new A(e)}}static config(e){}static import(e){}};$!=="other"&&Object.assign(P,{serve(t){new G(t)}});export{P as Workio};
