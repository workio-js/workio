import { WorkioWorker } from './Worker.js';
import { WorkioFunction } from './Function.js';

export class Workio {
	/**
	 * @param { Function } workerFn Describes function which executed on worker thread.
	 *
	 * @param { Object } [config]
	 * @param { Boolean } [config.multiplex]
	 */

	constructor(workerFn, config) {
		switch (false) {
			case new.target:
			case workerFn instanceof Function:
				return undefined;

			default:
				return function WorkioInitializer(...workerArgs) {
					return (new.target)
						? new WorkioWorker({ workerFn, workerArgs })
						: new Promise((resolve) =>
							new WorkioFunction({ resolve, workerFn, workerArgs })
						);
				};
		}
	}
}
