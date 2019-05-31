import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default [{
  input: './index.js',
  external: [
    'bcrypt',
    'fs',
    'http',
    'net',
    'node-schedule',
    'tls'
  ],
  output: [{
    file: 'dist/http.cjs.js',
    format: 'cjs',
  }, {
    extend: true,
    file: 'dist/http.umd.js',
    format: 'umd',
    name: 'scola'
  }],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    buble()
  ]
}];
