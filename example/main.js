import { Workio } from "../src/Workio.js"

const ExampleWorker = new Workio(() => {

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

console.log(await instance.calc());

await instance.close();