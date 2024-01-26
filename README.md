# [Workio](https://workio.dev)
![Static Badge](https://img.shields.io/badge/80-gray?logo=google-chrome&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/80-gray?logo=microsoft-edge&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/67-gray?logo=opera&logoColor=e44&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/114-gray?logo=firefox&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/15-gray?logo=safari&labelColor=gray&color=lightgreen&logoColor=lightblue)
![Static Badge](https://img.shields.io/badge/1.0-gray?logo=deno&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/12-gray?logo=nodedotjs&labelColor=gray&color=lightgreen&logoColor=12ff15)

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