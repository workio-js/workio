import { runtimeKey } from '../util/RuntimeKey.js';

/**
 * @param { String } scriptStr
 */

const URLStorage = new Map();

export function scriptURL(scriptStr) {
	switch (runtimeKey) {
		case 'node':
			return scriptStr;
		default:
			const URLBuffer = URLStorage.get(scriptStr);
			if (URLBuffer === undefined) {
				const ScriptURL = URL.createObjectURL(
					new Blob([scriptStr], { type: 'application/javascript' }),
				);
				URLStorage.set(scriptStr, ScriptURL);
				return ScriptURL;
			} else {
				return URLBuffer;
			}
	}
}
