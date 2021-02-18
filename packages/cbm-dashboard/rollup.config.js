import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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
    commonjs(),
    babel({ exclude: 'node_modules/**' }),
  ],
  external: ['react', 'react-dom'],
};
