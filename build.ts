import esbuild from 'esbuild';


await esbuild.build({
  entryPoints: ['lib/mod.ts'],
  target: 'es6',
  bundle: true,
  outfile: 'octiron.js',
  format: 'esm',
  external: ['mithril', 'jsonld'],
  treeShaking: true,
});

await esbuild.build({
  entryPoints: ['lib/mod.ts'],
  target: 'es6',
  bundle: true,
  outfile: 'octiron.min.js',
  format: 'esm',
  external: ['mithril', 'jsonld'],
  treeShaking: true,
  minify: true,
});

const command = new Deno.Command('./node_modules/.bin/tsc', {
  args: [
    './lib/mod.ts',
    '--outFile', './octiron.d.ts',
    '--emitDeclarationOnly',
    '--declaration',
  ],
  stdin: 'piped',
  stdout: 'piped',
});

const process = command.spawn();
await process.output();