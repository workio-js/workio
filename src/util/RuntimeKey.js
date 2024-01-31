export const runtimeKey = globalThis?.process?.release?.name === 'node'
	? 'node'
	: globalThis?.Deno !== undefined
	? 'deno'
	: globalThis?.Bun !== undefined
	? 'bun'
	: globalThis?.fastly !== undefined
	? 'fastly'
	: globalThis?.__lagon__ !== undefined
	? 'lagon'
	: globalThis?.WebSocketPair instanceof Function
	? 'workerd'
	: globalThis?.EdgeRuntime instanceof String
	? 'edge-light'
	: 'other';
