export function constConfig(config) {
	return {
		type: 'type' in config ? config.type : 'web',
		shared: 'shared' in config ? config.shared : undefined,
		immidiate: 'immidiate' in config ? config.immidiate : false,
	};
}
