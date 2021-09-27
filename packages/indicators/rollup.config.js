import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';

export default {
  input: 'src/App.jsx',
  output: [
    {
      dir: './dist',
      format: 'cjs',
      exports: 'named',
      strict: false,
    },
  ],
  plugins: [
    nodeResolve({ extensions: ['.jsx', '.js'] }),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    commonjs(),
    css({ output: 'bundle.css' }),
  ],
  external: ['react', 'react-dom'],
};
