import { runtimeKey } from '../util/RuntimeKey.js';

/**
 * @param { String } scriptStr
 */

export function scriptURL(scriptStr) {
	return (runtimeKey === 'node')
		? scriptStr
		: URL.createObjectURL(new Blob([scriptStr], { type: 'application/javascript' }));
}
