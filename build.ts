import esbuild from 'esbuild';


await esbuild.build({
  entryPoints: ['lib/octiron.ts'],
  target: 'es6',
  bundle: true,
  outfile: 'octiron.js',
  format: 'esm',
  external: ['mithril', 'jsonld'],
  treeShaking: true,
  sourcemap: true,
});

await esbuild.build({
  entryPoints: ['lib/octiron.ts'],
  target: 'es6',
  bundle: true,
  outfile: 'octiron.min.js',
  format: 'esm',
  external: ['mithril', 'jsonld'],
  treeShaking: true,
  minify: true,
  sourcemap: true,
});

const command = new Deno.Command('./node_modules/.bin/tsc', {
  args: [
    './lib/octiron.ts',
    '--outFile', './octiron.d.ts',
    '--emitDeclarationOnly',
    '--declaration',
  ],
  stdin: 'piped',
  stdout: 'piped',
});

const process = command.spawn();
await process.output();