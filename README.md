# [```Workio```](https://workio.dev)
Workio is a JavaScript library for building and managing Web Workers.


```javascript
// Install
const { Workio } = await import("https://workio.dev/@0.0.1/mod.js");

const WorkerTemplate = new Workio((myName) => {
	function sayHello(yourName) {
		return `Hello, ${yourName} from ${myName}!`
	}
	return { sayHello, close } // self.close()
});

const workerInstance = new WorkerTemplate("Workio"); // create web worker

console.log(await workerInstance.sayHello("Foo")); // "Hello Foo from Workio!"

await workerInstance.close()
```