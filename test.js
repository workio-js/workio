var c=class{constructor(){this.pool={},this.nextId=0,this.vacantId=[]}newTask({resolve:e,reject:t}){let o=null;return this.vacantId.length?(o=this.vacantId[0],this.vacantId.shift()):(o=this.nextId,this.nextId++),this.pool[o]={resolve:e,reject:t},o}setResponse({taskId:e,returnValue:t}){this.pool[e].resolve(t),this.taskGC({taskId:e})}rejectResponse({taskId:e}){this.pool[e].reject("a"),this.taskGC({taskId:e})}taskGC({taskId:e}){this.pool[e]=void 0,e+1===this.nextId?this.nextId--:this.vacantId.push(e)}};var g=new Map;var a=class{constructor({workerFn:e,config:t,constructorArgs:o}){let r=new Worker("./WorkioTemplate.js",{type:"module"}),i=new c,u=null;return r.postMessage({functionBody:e.toString(),constructorArgs:o}),r.addEventListener("message",({data:s})=>{if(s.sudo)switch(u){case null:u=s.sudo;break;case s.sudo:if(s.close){r.terminate();return}s.returnValue&&i.setResponse(s),s.methodNotFound&&i.rejectResponse(s);break}},{passive:!0}),new Proxy(this,{get(s,h,j){return function(){return new Promise((m,f)=>{let k=i.newTask({resolve:m,reject:f});r.postMessage({task:h,args:[...arguments],taskId:k})})}}})}};var l=class{constructor(){}};var p=class{};var d=class{constructor(e,t){if(!e instanceof Function)throw new TypeError("workerFn is not a type of function");let o={};switch(t&&t.as?o.type=t.as:o.type="worker",o.type){case"worker":return class extends a{constructor(...r){super({workerFn:e,config:t,constructorArgs:r})}};case"object":return new p(e,t);case"function":return new l(e,t)}}static configure(e){}static version(){open(URL.createObjectURL(new File([`
			<!DOCTYPE html>
			<html>
				<head>
					<title>Workio 1.0.0</title>
				</head>
				<body>
					<label>Workio.js</label>
				</body>
			</html>
		`.replace(/\t|\n/g,"")],"debug.html",{type:"text/html"})))}};export{d as Workio};
