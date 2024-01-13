export const AM_I_NODE = (() => {
	try { global } catch(error) {
		if(error) return false
	}
	return true
})()