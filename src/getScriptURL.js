/**
 * @param { String } scriptStr 
 */

export function getScriptURL(scriptStr) {
	return URL.createObjectURL(new File([scriptStr], "workioscript.js", { type: "application/javascript" }));
};