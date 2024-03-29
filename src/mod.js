import { workerTemp } from './template.js';
import { random64 } from './random64.js';
import { runtimeKey } from './runtimeKey.js';
import { TaskPool } from './taskPool.js';

/**
 * @param { Function } workerFn
 * @returns { Function }
 */

export class Workio {
	constructor(workerFn) {
		switch (false) {
			case new.target:
			case workerFn instanceof Function: {
				return undefined;
			}

			default: {
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
										runtimeKey === 'other'
											? `'${window.location.href}'`
											: 'undefined',
									)
									.replace(/'\\0workerFn\\0'/, `(${workerFn.toString()})`)
							})()`,
						], { type: 'application/javascript' }),
					);

				return function (...initArgs) {
					const isConstructed = !!new.target;

					return new Promise(
						(resolveInit, rejectInit) => {
							const workerInstance = new Worker(workerURL, {
								type: 'module',
								eval: true,
							});

							if (isConstructed) {
								const taskPool = new TaskPool(),
									methodObject = {};

								workerInstance.postMessage({
									code: 0,
									initArgs,

									sudoKey,
								});
								workerInstance.addEventListener('message', ({ data }) => {
									if (data.sudoKey === sudoKey) {
										/**
										 * 0: init success
										 * 1: init failed
										 * 2: exec success
										 * 3: exec failed
										 * 4: close
										 */

										({
											0({ methodList }) {
												methodList.forEach((methodName) => {
													methodObject[methodName] = (...workerArgs) =>
														new Promise((resolveExec, rejectExec) => {
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
														});
												});
												resolveInit(methodObject);
											},

											1() {
												rejectInit('Failed to initialization');
											},

											2({ returnValue, taskId }) {
												taskPool.resolve({ returnValue, taskId });
											},

											3({ taskId }) {
												taskPool.reject({ taskId });
											},

											4({ taskId }) {
												taskPool.resolve({ taskId });
												workerInstance.terminate();
												for (const methodObjectIndex in methodObject) {
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
								});

								workerInstance.addEventListener('message', ({ data }) => {
									if (data.sudoKey === sudoKey) {
										resolveInit(data.returnValue);
										workerInstance.terminate();
									}
								}, { passive: true });
							}
						},
					);
				};
			}
		}
	}
}
