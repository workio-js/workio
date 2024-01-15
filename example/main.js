import { Workio } from "../src/Workio.js"

const ExampleWorker = new Workio(() => {

	function echo(name) {
		return "hello, " + name
	};

	return { echo }

}, { as: "worker" })

console.log(ExampleWorker)

const instance = new ExampleWorker();

setTimeout(async () => {
	console.log(await instance.echo("wow"))
}, 1000)