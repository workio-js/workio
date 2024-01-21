const { Workio } = await import("../@0.0.4/mod.js");

const HelloWorker = new Workio(() => {

	function sayHello(name) {
		return `Hello, ${name}!`;
	}
	
	return { sayHello, close }

});

const instance = new HelloWorker();

console.log(await instance.sayHello("worker"))

await instance.close()