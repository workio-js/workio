# Get Started

## Installation

```javascript
const { Workio } = await import("https://workio.dev/@0.1.0/min.js");
```

## Immidiate Process
```javascript
const calc = new Workio((length) => {
	let buffer = 0;
	for(let i = 0; i < buffer; i++) {
		buffer = i;
	}
	return buffer;
});

console.log(await calc(1e9)) // 999999999
```

## Instance Template
```javascript
const ImgTemp = new Workio(() => {
	function write() {

	}

	return { write, close }
});

const instance = await new ImgTemp();

document.body.innerHTML = await instance.write();

instance.close()
```