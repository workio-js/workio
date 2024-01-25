const { copy, exists } = await import("https://deno.land/std@0.212.0/fs/mod.ts")


const releaseVersion = Deno.args[Deno.args.lastIndexOf("--version") + 1]
if(await exists(`./build/@${releaseVersion}`)) {
	console.log("version already exists")
} else {
	Deno.mkdir(`./release/@${releaseVersion}`);
	copy("./build/mod.js", `./release/@${releaseVersion}/mod.js`)
	copy("./build/min.js", `./release/@${releaseVersion}/min.js`)
	// copy("./docs/docs/.vitepress/dist", `./release/*`)
}