const { runtimeKey } = await import('../util/RuntimeKey.js');
// const { URL } = await import("node:url")

/**
 * @param { String } scriptStr
 */

export function scriptURL(scriptStr) {
	return (runtimeKey === 'node')
		? scriptStr
		: URL.createObjectURL(new Blob([scriptStr], { type: 'application/javascript' }));
}
