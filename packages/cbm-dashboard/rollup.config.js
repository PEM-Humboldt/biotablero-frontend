import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/App.jsx',
  output: [
    {
      // file: "cbm-dashboard.min.js",
      dir: './dist',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    nodeResolve({ extensions: ['.jsx', '.js'] }),
    commonjs(),
    babel({ exclude: 'node_modules/**' }),
  ],
  external: ['react', 'react-dom'],
};
