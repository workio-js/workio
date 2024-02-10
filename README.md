# [Workio](https://workio.dev)

![Static Badge](https://img.shields.io/badge/Chrome-80-gray?logo=google-chrome&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Edge-80-gray?logo=microsoft-edge&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Opera-67-gray?logo=opera&logoColor=e44&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Firefox-114-gray?logo=firefox&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Safari-15-gray?logo=safari&labelColor=gray&color=lightgreen&logoColor=lightblue)
![Static Badge](https://img.shields.io/badge/Deno-1.0-gray?logo=deno&labelColor=gray&color=lightgreen)
<!-- ![Static Badge](https://img.shields.io/badge/Node.js-12-gray?logo=nodedotjs&labelColor=gray&color=lightgreen&logoColor=12ef15) -->

Workio is a JavaScript library for building and managing Web Workers.
- **Touch-and-Go:** No more worker.js to build additional off-thread operations. offload to comfortable worker threads with single line.
- **I/O Optimization:** Caching is available for large primitives.
- **Thin and Safe:** 

[Visit StackBlitz for your first step into the developer experience at Workio.](https://stackblitz.com/edit/web-platform-hceprw?file=script.js)  

```javascript
const { Workio } = await import("https://workio.dev/@0.1.0/mod.js");

const WorkerTemplate = new Workio((myName) => {
    function sayHello(yourName) {
        return `Hello, ${yourName} from ${myName}!` // use constructor arguments
    }
    return { sayHello, close } // expose methods as return value (inventive part!)
});

const workerInstance = await new WorkerTemplate("Workio"); // create web worker

console.log(await workerInstance.sayHello("Worker")); // "Hello Worker from Workio!" 

workerInstance.close();
```
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/web-platform-hceprw?file=script.js)