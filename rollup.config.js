import buble from 'rollup-plugin-buble';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const input = './index.js';

const external = [
  'bcrypt',
  'busboy',
  'fs',
  'fs-extra',
  'http',
  'msgpack-lite',
  'net',
  'parse5',
  'shortid',
  'tls'
];

const plugins = [
  resolve(),
  commonjs(),
  builtins(),
  json(),
  buble()
];

export default [{
  input,
  external,
  output: {
    extend: true,
    file: 'dist/http.umd.js',
    format: 'umd',
    name: 'scola.http'
  },
  plugins
}, {
  input,
  external,
  output: {
    file: 'dist/http.cjs.js',
    format: 'cjs'
  },
  plugins
}];
