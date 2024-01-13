export class ScriptURL {
	/**
	 * @param { Function } scriptStr 
	 */
	constructor(scriptStr) {
		if(!(scriptStr instanceof Function)) {
			throw new TypeError("the first argument is not the type of Function")
		}
		this.objectURL = URL.createObjectURL(new Blob([scriptStr], { type: "application/javascript" }));
	};
	revoke() {
		URL.revokeObjectURL(this.objectURL);
	}
};