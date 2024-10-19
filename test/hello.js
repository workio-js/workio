const { Workio } = await import('../build/min.js');

performance.mark('define');

const Calculator = new Workio((myName) => {
	function echo(yourName) {
		return `Hello ${yourName} from ${myName}!`;
	}
	return { echo, close }; // expose as return value
});

performance.mark('construct');

const instance = await new Calculator('Workio');

performance.mark('call');

console.log(await instance.echo('Worker'));

performance.mark('close');

await instance.close();

performance.mark('finish');

console.log(
	performance.getEntriesByType('mark')
		.map(({ name, startTime }, index, array) =>
			index === array.length - 1
				? null
				: `${name}: ${array[index + 1].startTime - startTime}ms`
		)
		.filter(Boolean)
		.join('\n'),
);

performance.clearMarks();
performance.clearMeasures();