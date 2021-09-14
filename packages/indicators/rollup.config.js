import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import reactSvg from 'rollup-plugin-react-svg';

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
    reactSvg({
      svgo: {
        plugins: ['./src/icons/**'],
        multipass: true,
      },
    }),
  ],
  external: ['react', 'react-dom'],
};
