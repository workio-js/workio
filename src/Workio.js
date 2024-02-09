import { WorkioWorker } from './Worker.js';
import { WorkioFunction } from './Function.js';
import { workerTemp } from './template/WorkerTemp.js';
import { random64 } from './util/Random64.js';
import { runtimeKey } from './util/RuntimeKey.js';

// export class Workio {
// 	/**
// 	 * @param { Function } workerFn Describes function which executed on worker thread.
// 	 *
// 	 * @param { Object } [config]
// 	 * @param { Boolean } [config.multiplex]
// 	 */

// 	constructor(workerFn, config) {
// 		switch (false) {
// 			case new.target:
// 			case workerFn instanceof Function:
// 				return undefined;

// 			default:
// 				return function WorkioInitializer(...workerArgs) {
// 					return (new.target)
// 						? new WorkioWorker({ workerFn, workerArgs })
// 						: new Promise((resolve) =>
// 							new WorkioFunction({ resolve, workerFn, workerArgs })
// 						);
// 				};
// 		}
// 	}
// }

export class Workio {
	/**
	 * @param { Function } workerFn
	 * @returns { Function }
	 */

	constructor(workerFn) {
		if (
			!(
				new.target &&
				workerFn instanceof Function
			)
		) return undefined;

		const sudoKey = random64(),
			workerURL = URL.createObjectURL(
				new Blob([
					`(${
						workerTemp
							.toString()
							.replace(/\\0sudoKey\\0/, sudoKey)
							.replace(/\\0runtimeKey\\0/, runtimeKey)
							.replace(
								/'\\0base\\0'/,
								runtimeKey === 'other' ? `'${window.location.href}'` : 'undefined',
							)
							.replace(/'\\0workerFn\\0'/, `(${workerFn.toString()})`)
					})()`,
				], { type: 'application/javascript' }),
			);

		return function (...initializerArg) {
			return new Promise(function (resolveInit, rejectInit) {
				const workerInstance = new Worker(workerURL, { type: 'module', eval: true });

				if (new.target) {
					workerInstance.postMessage(
						{
							initializerArg,
							sudoKey,
							isInstance: true,
						},
					);
					workerInstance.addEventListener('message', function ({ data }) {
						if (data.sudoKey === sudoKey) {
							if (data.initSucceed) {
								const pFIResult = {};

								for (const pFIIndex in data.publicFunctionInterface) {
									pFIResult[pFIIndex.name] = function () {
									};
								}

								resolveInit(pFIResult);
							} else {
								rejectInit();
							}
						}
					}, { passive: true });
				} else {
					workerInstance.postMessage(
						{
							initializerArg,
							sudoKey,
							isInstance: false,
						},
					);
					workerInstance.addEventListener('message', function ({ data }) {
						if (data.sudoKey === sudoKey) {
							if (data.initSucceed) {
								resolveInit(data.returnValue);
							} else {
								rejectInit();
							}
							workerInstance.terminate();
						}
					}, { once: true, passive: true });
				}
			});
		};
	}
}
