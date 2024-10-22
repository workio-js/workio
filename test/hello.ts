import { Workio } from '../src/mod.ts';

using myWorkio = await Workio("./module.workio.ts", import.meta.url);

console.log(await myWorkio.sum(1, 2));

// Workio.terminate(myWorkio);

// const immidiateWorkio = await Workio("./immidiate.workio.js", import.meta.url);

// console.log(await immidiateWorkio(1, 2))

// Workio.terminate(immidiateWorkio)