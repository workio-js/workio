export const runtimeKey = 
	globalThis?.Deno !== undefined?						"deno":
	globalThis?.Bun !== undefined?						"bun":
	globalThis?.fastly !== undefined?					"fastly":
	globalThis?.__lagon__ !== undefined?				"lagon": 

	globalThis?.process?.release?.name === "node"?		"node":

	globalThis?.WebSocketPair instanceof Function?		"workerd":
	globalThis?.EdgeRuntime instanceof String?			"edge-light": "other"