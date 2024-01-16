import { Workio } from "../build/WorkioBuild.js"

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

(async () => {
	console.log(await instance.calc());
	
	await instance.close();
})()