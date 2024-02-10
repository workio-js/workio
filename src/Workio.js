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

		return function () {
			const initTarget = !!new.target;

			return new Promise(
				function (resolveInit, rejectInit) {
					const workerInstance = new Worker(workerURL, { type: 'module', eval: true });

					if (initTarget) {
						const taskPool = new TaskPool();
						workerInstance.postMessage({
							type: 'init',
							initArgs: Array.from(arguments),
							sudoKey,
							isInstance: true,
						});
						workerInstance.addEventListener('message', function ({ data }) {
							if (data.sudoKey === sudoKey) {
								/**
								 * 0: init success
								 * 1: init failed
								 * 2: exec success
								 * 3: exec failed
								 * 4: req
								 */

								({
									0({ publicFunctionInterface }) {
										const pFIResult = {};

										for (const method in publicFunctionInterface) {
											pFIResult[method] = {
												value: function () {
													return new Promise(
														function (resolveExec, rejectExec) {
															workerInstance.postMessage({
																type: 'exec',
																method,
																workerArgs: Array.from(arguments),
																taskId: taskPool.push({
																	resolveExec,
																	rejectExec,
																}),
															});
														},
													);
												},
												writable: false,
												enumerable: true,
											};
										}
										resolveInit(Object.defineProperties({}, pFIResult));
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

									4({ path, taskId }) {
									},
								})[data.code](data);
							}
						}, { passive: true });
					} else {
						workerInstance.postMessage({
							type: 'func',
							initArgs: Array.from(arguments),
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
