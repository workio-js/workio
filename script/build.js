const
	esbuild = await import('https://deno.land/x/esbuild@v0.11.17/mod.js'),
	{ denoPlugin } = await import("https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts")

const mainBuiltText = (await esbuild.build({
	plugins: [denoPlugin()],
	// 対象ファイル名
	entryPoints: ["./src/Workio.js"],
	write: false,
	bundle: true,
	minify: true,
	format: "esm",
})).outputFiles[0].text

esbuild.stop()

await Deno.writeTextFile("./build/mod.js", mainBuiltText)