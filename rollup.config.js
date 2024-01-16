import terser from '@rollup/plugin-terser';

export default ["Workio", "WorkioTemplate"].map((name, index) => ({
	input: `src/${name}.js`,
	output: {
		dir: 'build',
		format: 'esm'
	},
	plugins: [terser()]
}))