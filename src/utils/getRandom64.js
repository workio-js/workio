export function random64() {
	return btoa(
		String.fromCharCode.apply(
			null,
			crypto.getRandomValues(new Uint8Array(64))
		)
	)
}