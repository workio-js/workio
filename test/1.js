import { Workio } from "../src/Workio.js"

const ExampleWorker = new Workio(({ max }) => {

	function calc(length) {
		let buffer = 0;
		if(max < length) {
			return 0;
		}
		for(let i = 0; i < length; i++) {
			buffer = i;
		};
		return buffer;
	}

	return { calc, close }

});

const instance = new ExampleWorker({ max: 1e9 });

console.log("calc start");

// (async () => {
// })()

console.log(await instance.calc(1e9));

await instance.close();