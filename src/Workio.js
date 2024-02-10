import { WorkioWorker } from './Worker.js';
import { WorkioFunction } from './Function.js';
import { workerTemp } from './template/WorkerTemp.js';
import { random64 } from './util/Random64.js';
import { runtimeKey } from './util/RuntimeKey.js';
import { TaskPool } from './core/TaskPool.js';

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

		return function (...initArgs) {
			const initTarget = !!new.target;

			return new Promise(
				function (resolveInit, rejectInit) {
					const workerInstance = new Worker(workerURL, { type: 'module', eval: true });

					if (initTarget) {
						const taskPool = new TaskPool(),
							methodObject = {};

						workerInstance.postMessage({
							code: 0,
							initArgs,
							sudoKey,
						});
						workerInstance.addEventListener('message', function ({ data }) {
							if (data.sudoKey === sudoKey) {
								/**
								 * 0: init success
								 * 1: init failed
								 * 2: exec success
								 * 3: exec failed
								 * 4: func success
								 * 5: func failed
								 * 6: close
								 */

								({
									0({ methodList }) {
										methodList.forEach((methodName) => {
											methodObject[methodName] = function (...workerArgs) {
												return new Promise(
													function (resolveExec, rejectExec) {
														workerInstance.postMessage({
															code: 1,
															methodName,
															workerArgs,
															taskId: taskPool.push({
																resolveExec,
																rejectExec,
															}),

															sudoKey,
														});
													},
												);
											}
										});
										resolveInit(methodObject);
									},

									1() {
										rejectInit('Failed to initialization');
									},

									2({ returnValue, taskId }) {
										taskPool.setResponse({ returnValue, taskId });
									},

									3({ taskId }) {
										taskPool.rejectResponse(taskId);
									},

									6({ taskId }) {
										taskPool.setResponse({ taskId });
										workerInstance.terminate();
										for(const methodObjectIndex in methodObject) {
											delete methodObject[methodObjectIndex];
										}
									},
								})[data.code](data);
							}
						}, { passive: true });
					} else {
						workerInstance.postMessage({
							code: 2,
							initArgs,
							sudoKey,
							isInstance: false,
						});
						workerInstance.addEventListener('message', function ({ data }) {
							if (data.sudoKey === sudoKey) {
								if (data.initSucceed) {
									resolveInit(data.returnValue);
								} else {
									rejectInit();
								}
								workerInstance.terminate();
							}
						}, { passive: true });
					}
				},
			);
		};
	}
}
