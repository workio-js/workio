# [Workio](https://workio.dev)

![Static Badge](https://img.shields.io/badge/Chrome-80-gray?logo=google-chrome&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Edge-80-gray?logo=microsoft-edge&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Opera-67-gray?logo=opera&logoColor=e44&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Firefox-114-gray?logo=firefox&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Safari-15-gray?logo=safari&labelColor=gray&color=lightgreen&logoColor=lightblue)
![Static Badge](https://img.shields.io/badge/Deno-1.0-gray?logo=deno&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Node.js-12-gray?logo=nodedotjs&labelColor=gray&color=lightgreen&logoColor=12ef15)

Workio is a JavaScript library for building and managing Web Workers.
- **Touch-and-Go:** No more worker.js to build additional off-thread operations. offload to comfortable worker threads with single line.
- **Promise-based:** 
- **I/O Optimization:** Caching is available for large primitives.

[Visit StackBlitz for your first step into the developer experience at Workio.](https://stackblitz.com/edit/web-platform-hceprw?file=script.js)  

```javascript
// Install
const { Workio } = await import("https://workio.dev/@0.0.8/mod.js");

const WorkerTemplate = new Workio((myName) => {
    function sayHello(yourName) {
        return `Hello, ${yourName} from ${myName}!` // use constructor arguments
    }
    return { sayHello, close } // expose methods as return value
});

const workerInstance = new WorkerTemplate("Workio"); // create web worker

console.log(await workerInstance.sayHello("Foo")); // all methods are async

await workerInstance.close();
```
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/web-platform-hceprw?file=script.js)