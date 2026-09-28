import {build} from 'esbuild';
await build({entryPoints:['electron/main.ts','electron/preload.ts'],bundle:true,platform:'node',target:'node22',format:'cjs',outdir:'desktop',outExtension:{'.js':'.cjs'},external:['electron']});
