const { Workio } = await import('../build/min.js');

performance.mark('define');

const calcImmidiate = new Workio((yourName) => `Hello ${yourName}!`);

performance.mark('call');

console.log(await calcImmidiate('Workio'));

performance.mark('finish');

console.log(
	performance.getEntriesByType('mark')
		.map(({ name, startTime }, index, array) =>
			index !== array.length - 1
				? `${name}: ${array[index + 1].startTime - startTime}ms`
				: null
		)
		.filter(Boolean)
		.join('\n'),
);

performance.clearMarks();
performance.clearMeasures();
