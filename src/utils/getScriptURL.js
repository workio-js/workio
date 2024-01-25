const { runtimeKey } = await import("./getRuntimeKey.js")
// const { URL } = await import("node:url")

/**
 * @param { String } scriptStr 
 */

export function getScriptURL(scriptStr) {
	return (runtimeKey === "node")? scriptStr : URL.createObjectURL(new Blob([scriptStr], { type: "application/javascript" }))
};