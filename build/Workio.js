class t{constructor(){this.pool={},this.nextId=0,this.vacantId=[]}newTask({resolve:t,reject:e}){let s=null;return this.vacantId.length?(s=this.vacantId[0],this.vacantId.shift()):(s=this.nextId,this.nextId++),this.pool[s]={resolve:t,reject:e},s}setResponse({taskId:t,returnValue:e}){this.pool[t].resolve(e),this.taskGC({taskId:t})}rejectResponse({taskId:t}){this.pool[t].reject("a"),this.taskGC({taskId:t})}taskGC({taskId:t}){this.pool[t]=void 0,t+1===this.nextId?this.nextId--:this.vacantId.push(t)}}class e{constructor({workerFn:e,config:s,constructorArgs:n}){const o=new Worker("./WorkioTemplate.js",{type:"module"}),r=new t;let a=null;return o.postMessage({functionBody:e.toString(),constructorArgs:n}),o.addEventListener("message",(({data:t})=>{if(t.sudo)switch(a){case null:a=t.sudo;break;case t.sudo:if(t.close)return void o.terminate();t.returnValue&&r.setResponse(t),t.methodNotFound&&r.rejectResponse(t)}}),{passive:!0}),new Proxy(this,{get:(t,e,s)=>function(){return new Promise(((t,s)=>{const n=r.newTask({resolve:t,reject:s});o.postMessage({task:e,args:[...arguments],taskId:n})}))}})}}class s{constructor(){}}class n{}class o{constructor(t,o){if(!t instanceof Function)throw new TypeError("workerFn is not a type of function");const r={};switch(o&&o.as?r.type=o.as:r.type="worker",r.type){case"worker":return class extends e{constructor(...e){super({workerFn:t,config:o,constructorArgs:e})}};case"object":return new n(t,o);case"function":return new s(t,o)}}static configure(t){}static version(){open(URL.createObjectURL(new File(["\n\t\t\t<!DOCTYPE html>\n\t\t\t<html>\n\t\t\t\t<head>\n\t\t\t\t\t<title>Workio 1.0.0</title>\n\t\t\t\t</head>\n\t\t\t\t<body>\n\t\t\t\t\t<label>Workio.js</label>\n\t\t\t\t</body>\n\t\t\t</html>\n\t\t".replace(/\t|\n/g,"")],"debug.html",{type:"text/html"})))}}export{o as Workio};