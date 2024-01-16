var c=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[]}newTask({resolve:t,reject:e}){let s=null;return this.vacantId.length?(s=this.vacantId[0],this.vacantId.shift()):(s=this.nextId,this.nextId++),this.pool[s]={resolve:t,reject:e},s}setResponse({taskId:t,returnValue:e}){this.pool[t].resolve(e),this.taskGC({taskId:t})}rejectResponse({taskId:t}){this.pool[t].reject("a"),this.taskGC({taskId:t})}taskGC({taskId:t}){this.pool[t]=void 0,t+1===this.nextId?this.nextId--:this.vacantId.push(t)}};function d(n){return URL.createObjectURL(new File([n],"workioscript.js",{type:"application/javascript"}))}var a=class{constructor({workerFn:t,config:e,constructorArgs:s}){let r=new Worker(d(`
			(async () => {
					
				let sudo = crypto.randomUUID();
			
				self.postMessage({ sudo });
			
				self.close = function() {
					self.postMessage({ close: true, sudo })
				};
			
				const publicFunctionInterface = {};
			
				for(const index in publicFunctionInterface) {
					if(!(publicFunctionInterface[index] instanceof Function)) {
						delete publicFunctionInterface[index]
					}
				};
			
				self.addEventListener("message", async ({ data }) => {
					if("task" in data) {
						if(data.task in publicFunctionInterface) {
							self.postMessage({ returnValue: await publicFunctionInterface[data.task](...data.args), taskId: data.taskId, sudo })
						} else {
							self.postMessage({ methodNotFound: true, taskId: data.taskId, sudo })
						}
					}
					if(data.constructorArgs && data.functionBody) {
						let sudo = undefined;
						Object.assign(publicFunctionInterface, await new Function(functionBody)(data.constructorArgs))
					}
					if(data.functionBody) {
			
					}
				}, { passive: true });
			
			})()
		`),{type:"module"}),i=new c,p=null;return r.postMessage({functionBody:t.toString(),constructorArgs:s}),r.addEventListener("message",({data:o})=>{if(o.sudo)switch(p){case null:p=o.sudo;break;case o.sudo:if(o.close){r.terminate();return}o.returnValue&&i.setResponse(o),o.methodNotFound&&i.rejectResponse(o);break}},{passive:!0}),new Proxy(this,{get(o,f,g){return function(){return new Promise((k,h)=>{let I=i.newTask({resolve:k,reject:h});r.postMessage({task:f,args:[...arguments],taskId:I})})}}})}};var u=class{constructor(){}};var l=class{};var m=class{constructor(t,e){if(!(t instanceof Function))throw new TypeError("workerFn is not a type of function");let s={};switch(e&&e.as?s.type=e.as:s.type="worker",s.type){case"worker":return class extends a{constructor(...r){super({workerFn:t,config:e,constructorArgs:r})}};case"object":return new l(t,e);case"function":return new u(t,e)}}static configure(t){}};export{m as Workio};
