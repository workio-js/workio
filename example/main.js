import { Workio } from "../src/Workio.js"

await new Workio((name) => `Hello, ${name} from Workio!`, { type: Function })()