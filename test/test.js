// const { workerTemp } = await import("../src/Worker.js");

// console.log(workerTemp.toString());

const template = "return Deno.cwd()";

setTimeout(() => {
	console.log(new Function(template)())
}, 1000)