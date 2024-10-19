# [Workio](./book/get-started.md)

![Static Badge](https://img.shields.io/badge/Chrome-80-gray?logo=google-chrome&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Edge-80-gray?logo=microsoft-edge&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Opera-67-gray?logo=opera&logoColor=e44&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Firefox-114-gray?logo=firefox&labelColor=gray&color=lightgreen)
![Static Badge](https://img.shields.io/badge/Safari-15-gray?logo=safari&labelColor=gray&color=lightgreen&logoColor=lightblue)
![Static Badge](https://img.shields.io/badge/Deno-1.0-gray?logo=deno&labelColor=gray&color=lightgreen)
<!-- ![Static Badge](https://img.shields.io/badge/Node.js-12-gray?logo=nodedotjs&labelColor=gray&color=lightgreen&logoColor=12ef15) -->

Workio is a JavaScript library for building and managing Web Workers.
<details>
<summary><b>Touch-and-Go:</b> No more worker.js to build additional off-thread operations. offload to comfortable worker threads with single line.</summary>
<br>

```javascript
const { Workio } = await import("https://workio.dev/@0.1.0/mod.js");

const instance = await Workio("./module.js", import.meta.url);

console.log(await instance.sum(1, 2)); // "3" 

Workio.terminate(workioInstance);
```

```javascript
// module.js

export const sum = (a, b) => a + b;
```

</details>
<details>
<summary><b>I/O Optimization:</b> Caching is available for large primitives.</summary>
<br>
This is how you dropdown.
</details>
<details>
<summary><b>Thin and Safe:</b></summary>
<br>
This is how you dropdown.
</details>

[Visit StackBlitz for your first step into the developer experience at Workio.](https://stackblitz.com/edit/web-platform-hceprw?file=script.js)  

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/edit/web-platform-hceprw?file=script.js)
