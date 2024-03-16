const { Workio } = await import('../build/min.js');

performance.mark("define");

const calcImmidiate = new Workio((myName) => `Hello ${myName}!`);

performance.mark("call");

console.log(await calcImmidiate('Workio'));

performance.mark("finish");

performance.measure("define", "define", "call");
performance.measure("call", "call", "finish");

console.log(
	performance.getEntriesByType("measure")
		.map(({ name, duration }, index, array) => `${name}: ${duration}ms`)
		.join("\n")
)

performance.clearMarks();
performance.clearMeasures();