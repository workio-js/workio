export function random32() {
	return btoa(
		String.fromCharCode.apply(
			null,
			crypto.getRandomValues(new Uint8Array(32))
		)
	)
}