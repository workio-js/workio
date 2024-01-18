export function constConfig(config) {
	const constructorConfig = {}

	if(config) {
		if(config.as) {
			constructorConfig.type = config.as
		} else {
			constructorConfig.type = "worker"
		}
	} else {
		constructorConfig.type = "worker"
	}
}