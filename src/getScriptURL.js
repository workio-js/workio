const scriptURLCache = new Map()

/**
 * @param { String } scriptStr 
 */

export function getScriptURL(scriptStr) {
	if(!scriptURLCache.has(scriptStr)) {
		scriptURLCache.set(scriptStr, URL.createObjectURL(new File([scriptStr], "workioscript.js", { type: "application/javascript" })))
	}
	return scriptURLCache.get(scriptStr);
};