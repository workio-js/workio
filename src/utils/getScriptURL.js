/**
 * @param { String } scriptStr 
 */

export function getScriptURL(scriptStr) {
	return URL.createObjectURL(new Blob([scriptStr], { type: "application/javascript" }));
};