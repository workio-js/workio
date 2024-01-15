function catchFunction(fn) {
	console.log(fn.toString())
}

catchFunction(() => {
	self.postMessage()
})