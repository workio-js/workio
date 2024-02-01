const { Workio } = await import("../src/Workio.js");

const ExampleWorker = new Workio(async ({ max }) => {

	const res = await fetch("file:///home/ihasq/code/workio/test/test.js");
	const text = await res.text();
	console.log(text);

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

	return { calc, close };

});

const instance = new ExampleWorker({ max: 1e9 });

console.log(await instance.calc(1e9));

await instance.close();