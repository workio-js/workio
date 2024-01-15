const scriptURLCache = new Map()

/**
 * @param { String } scriptStr 
 */

export function getScriptURL(scriptStr) {
	if(!scriptURLCache.has(scriptStr)) {
		scriptURLCache.set(scriptStr, URL.createObjectURL(new Blob([scriptStr], { type: "application/javascript" })))
	}
	return scriptURLCache.get(scriptStr);
};