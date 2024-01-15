// ReadableStream のロングポーリングを導入するメリット：なし。遅延は軽減されるどころか増える

const worker = new Worker(URL.createObjectURL(new Blob([`{
	self.addEventListener("message", event => {
		const reader = event.data.getReader();
		reader.read().then(function readProcess({ done, value }) {
			if(done) {
				return;
			}
			console.log(value)
			console.log(Date.now())
			reader.read().then(readProcess)
		})
	}, { passive: true })
}`], { type: "application/javascript" })))

// const writable = new WritableStream({
// 	write(chunk) {
// 		return new Promise((resolve, reject) => {
// 			console.log(chunk);
// 			resolve();
// 		})
// 	}
// });

const readable = new ReadableStream({
	start(controller) {
		setInterval(() => {
			controller.enqueue(Date.now())
		}, 1000)
	}
})

worker.postMessage(readable, [readable])