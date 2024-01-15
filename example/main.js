import { Workio } from "../src/Workio.js"

const a = new Workio((name) => {
	return `Hello, ${name} from Workio!`
}, { as: Function })()