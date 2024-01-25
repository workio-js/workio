const
	esbuild = await import('https://deno.land/x/esbuild@v0.11.17/mod.js'),
	{ denoPlugin } = await import("https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts");

const workerTemp = (await esbuild.build({
	plugins: [denoPlugin()],
	// 対象ファイル名
	stdin: {
		contents: await Deno.readTextFile("./src/template/Worker.js")
	},
	// entryPoints: ["./src/template/Worker.js"],
	write: false,
	minify: true,
})).outputFiles[0].text.replace(/"\\0workerFn\\0"/, "(${workerFn.toString()})");

console.log(workerTemp)

const mod = (await esbuild.build({
	plugins: [denoPlugin()],
	entryPoints: ["./src/Workio.js"],
	write: false,
	bundle: true,
	format: "esm",
})).outputFiles[0].text.replace(/`\\0workerTemp\\0`/, `\`${workerTemp}\``)

await Deno.writeTextFile("./build/mod.js", mod)

const min = (await esbuild.build({
	plugins: [denoPlugin()],
	stdin: {
		contents: mod,
	},
	write: false,
	bundle: true,
	minify: true,
	format: "esm",
})).outputFiles[0].text

await Deno.writeTextFile("./build/min.js", min)

esbuild.stop()