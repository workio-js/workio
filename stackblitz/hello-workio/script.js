const { Workio } = await import('https://workio.dev/@0.0.11/mod.js');

const ExampleWorker = new Workio((myName) => {
  function echo(yourName) {
    return `Hello ${yourName} from ${myName}!`;
  }
  return { echo, close }; // expose as return value
});

const instance = new ExampleWorker('Workio');

document.body.textContent = await instance.echo('Worker');

await instance.close();