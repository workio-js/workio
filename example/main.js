import { Workio } from "../build/workio.min.js"

const ExampleWorker = new Workio(() => {

	self.onmessagestream()

	function calc() {
		let buffer = 0;
		for(let i = 0; i < 1e9; i++) {
			buffer = i;
		};
		return buffer;
	}

	return { calc, close }

});

const instance = new ExampleWorker();

console.log("calc start");
(async () => {
	console.log(await instance.calc());
	
	await instance.close();
})()