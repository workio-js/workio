import * as esbuild from 'https://deno.land/x/esbuild@v0.11.17/mod.js';
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";

let templateBuiltText = (await esbuild.build({
	plugins: [denoPlugin()],
	// 対象ファイル名
	entryPoints: ["./src/WorkioTemplate.js"],
	write: false,
	bundle: true,
	minify: true,
})).outputFiles[0].text;

let mainBuiltText = (await esbuild.build({
	plugins: [denoPlugin()],
	// 対象ファイル名
	entryPoints: ["./src/Workio.js"],
	write: false,
	bundle: true,
	format: "esm",
	minify: true,
})).outputFiles[0].text.replace(/"\\0templateBuiltText\\0/, "`" + templateBuiltText + "`")

await Deno.writeTextFile("./build/WorkioBuild.js", mainBuiltText)