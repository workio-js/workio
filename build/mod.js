var W=Object.defineProperty;var r=(e,t)=>()=>(e&&(t=e(e=0)),t);var i=(e,t)=>{for(var s in t)W(e,s,{get:t[s],enumerable:!0})};var h={};i(h,{getScriptURL:()=>l});function l(e){return URL.createObjectURL(new Blob([e],{type:"application/javascript"}))}var d=r(()=>{});var w={};i(w,{TaskPool:()=>k});var k,p=r(()=>{k=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[],this.reservedResponse=[]}newTask({resolve:t,reject:s}){let n=null;return this.vacantId.length?(n=this.vacantId[0],this.vacantId.shift()):(n=this.nextId,this.nextId++),this.pool[n]={resolve:t,reject:s},n}setResponse({taskId:t,returnValue:s}){this.pool[t].resolve(s),this.taskGC({taskId:t})}rejectResponse({taskId:t}){this.pool[t].reject("Method not found"),this.taskGC({taskId:t})}taskGC({taskId:t}){this.pool[t]=void 0,t+1===this.nextId?this.nextId--:this.vacantId.push(t)}}});var f={};i(f,{runtimeKey:()=>g});var g,u=r(()=>{g=globalThis?.process?.release?.name==="node"?"node":globalThis?.Deno!==void 0?"deno":globalThis?.Bun!==void 0?"bun":globalThis?.fastly!==void 0?"fastly":globalThis?.__lagon__!==void 0?"lagon":globalThis?.WebSocketPair instanceof Function?"workerd":globalThis?.EdgeRuntime instanceof String?"edge-light":"other"});var I={};i(I,{WorkioInstance:()=>b});var K,M,V,b,y=r(async()=>{({getScriptURL:K}=await Promise.resolve().then(()=>(d(),h))),{TaskPool:M}=await Promise.resolve().then(()=>(p(),w)),{runtimeKey:V}=await Promise.resolve().then(()=>(u(),f)),b=class{constructor({workerFn:t,constructorConfig:s,constructorArgs:n}){let a=new Worker(K(`
			(async () => {

				class WorkioOp {
					constructor() { }
				}

				let ENV = {
					OP_CLOSE: new WorkioOp()
				}

				self.close = function() {
					return ENV.OP_CLOSE
				};
					
				let sudo = crypto.randomUUID();
			
				self.postMessage({ sudo });

				const publicFunctionInterface = {};
			
				self.${V==="node"?"on":"addEventListener"}("message", async ({ data }) => {
					if(data.constructorArgs) {
						let sudo = undefined;

						Object.assign(publicFunctionInterface, await (${t.toString()})(...data.constructorArgs));

						for(const index in publicFunctionInterface) {
							if(!(publicFunctionInterface[index] instanceof Function)) {
								delete publicFunctionInterface[index]
							}
						};
					};
					if("task" in data) {
						if(data.task in publicFunctionInterface) {
							const returnValue = await publicFunctionInterface[data.task](...data.args);
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
		`),{type:"module"}),c=new M,m=null;return a.postMessage({constructorArgs:[...n]}),a.addEventListener("message",({data:o})=>{if(o.sudo)switch(m){case null:m=o.sudo;break;case o.sudo:"returnValue"in o&&(c.setResponse(o),o.close===!0&&a.terminate()),o.methodNotFound&&c.rejectResponse(o);break}},{passive:!0}),new Proxy(this,{get(o,P,D){return function(){return new Promise((E,O)=>{let U=c.newTask({resolve:E,reject:O});a.postMessage({task:P,args:[...arguments],taskId:U})})}}})}}});var j={};i(j,{WorkioFunction:()=>v});var v,x=r(()=>{p();d();u();v=class{constructor(t){let s=l(`
			self.${g==="node"?"on":"addEventListener"}("message", ({ data }) => {

			})
		`);return function(){let n=new Worker(s);return new Promise((a,c)=>{n.postMessage})}}}});var R={};i(R,{WorkioServer:()=>F});var F,T=r(()=>{F=class{constructor(t){}}});var L={};i(L,{constConfig:()=>_});function _(e){return{as:"as"in e?e.as:"worker",type:"type"in e?e.type:"web",shared:"shared"in e?e.shared:void 0,immidiate:"immidiate"in e?e.immidiate:!1}}var S=r(()=>{});var{WorkioInstance:N}=await y().then(()=>I),{WorkioFunction:A}=await Promise.resolve().then(()=>(x(),j)),{WorkioServer:G}=await Promise.resolve().then(()=>(T(),R)),{runtimeKey:$}=await Promise.resolve().then(()=>(u(),f)),{constConfig:B}=await Promise.resolve().then(()=>(S(),L)),C=class{constructor(t,s){if(!(t instanceof Function))throw new TypeError("workerFn is not a type of function");let n=B(s||{});switch(n.as){case"worker":return class extends N{constructor(){super({workerFn:t,constructorConfig:n,constructorArgs:arguments})}};case"function":return new A(t)}}static config(t){}static import(t){}};$!=="other"&&Object.assign(C,{serve(e){new G(e)}});export{C as Workio};
