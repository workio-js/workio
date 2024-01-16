import * as esbuild from 'https://deno.land/x/esbuild@v0.11.17/mod.js';
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";

let mainBuiltText = (await esbuild.build({
	plugins: [denoPlugin()],
	// 対象ファイル名
	entryPoints: ["./src/Workio.js"],
	write: false,
	bundle: true,
	format: "esm",
	minify: true,
})).outputFiles[0].text.replace(/\t|\n/g, "")

await Deno.writeTextFile("./build/WorkioBuild.js", mainBuiltText)