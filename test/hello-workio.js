import { Workio } from '../src/mod.js';

const myWorkio = await Workio("./module.workio.js", import.meta.url);

console.log(await (myWorkio.sum(1, 2)));

Workio.terminate(myWorkio);