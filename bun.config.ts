const isProduction = process.env.NODE_ENV === 'production';

export default {
  entry: 'src/index.ts',
  outdir: 'dist',
  clean: true,
  minify: isProduction,
  sourcemap: !isProduction,
  target: 'node', // Use "node" target to support Node.js builtins
  esbuild: {
    drop: isProduction ? ['console'] : [],
    minifyIdentifiers: isProduction,
    minifySyntax: isProduction,
  },
};
