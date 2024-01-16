import { Workio } from "../src/Workio.js"

const ExampleWorker = new Workio(() => {

	function echo(name) {
		return "hello, " + name
	};

	return { echo, close }

}, { as: "worker" })

console.log(ExampleWorker)

const instance = new ExampleWorker();

(async () => {
	console.log(await instance.echo("wow"))
	await instance.close()
})()
