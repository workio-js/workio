# [Workio](https://workio.dev)
![Static Badge](https://img.shields.io/badge/Chromium-80-lightgreen?logo=v8)
![Static Badge](https://img.shields.io/badge/Firefox-114-lightgreen?logo=firefox)
![Static Badge](https://img.shields.io/badge/Safari-67-lightgreen?logo=safari)
![Static Badge](https://img.shields.io/badge/Deno-1.0-lightgreen?logo=deno)

Workio is a JavaScript library for building and managing Web Workers.

```javascript
// Install
const { Workio } = await import("https://workio.dev/@0.0.1/mod.js");

const WorkerTemplate = new Workio((myName) => {
    function sayHello(yourName) {
        return `Hello, ${yourName} from ${myName}!` // use constructor arguments
    }
    return { sayHello, close } // expose methods as return value
});

const workerInstance = new WorkerTemplate("Workio"); // create web worker

console.log(await workerInstance.sayHello("Foo")); // "Hello Foo from Workio!"

await workerInstance.close()
```