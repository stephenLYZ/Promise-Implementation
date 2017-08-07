import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/Aromise.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  dest: 'lib/Aromise.js'
};