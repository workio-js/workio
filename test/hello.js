const { Workio } = await import('../build/min.js');

performance.mark("define");

const Calculator = new Workio((myName) => {
  function echo(yourName) {
    return `Hello ${yourName} from ${myName}!`;
  }
  return { echo, close }; // expose as return value
});

performance.mark("construct");

const instance = await new Calculator('Workio');

performance.mark("call");

console.log(await instance.echo('Worker'));

performance.mark("close");

await instance.close();

performance.mark("finish");


performance.measure("define", "define", "construct");
performance.measure("construct", "construct", "call");
performance.measure("call", "call", "close");
performance.measure("close", "close", "finish");

console.log(
	performance.getEntriesByType("measure")
		.map(({ name, duration }, index, array) => `${name}: ${duration}ms`)
		.join("\n")
)

performance.clearMarks();
performance.clearMeasures();