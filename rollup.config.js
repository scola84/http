import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'

const external = [
  '@scola/worker',
  'bcrypt',
  'busboy',
  'fs-extra',
  'http',
  'msgpack-lite',
  'net',
  'parse5',
  'shortid',
  'tls'
]

const globals = {
  '@scola/worker': 'scola.worker',
  bcrypt: 'bcrypt',
  busboy: 'busboy',
  'fs-extra': 'fsExtra',
  http: 'http',
  'msgpack-lite': 'msgpackLite',
  net: 'net',
  parse5: 'parse5',
  shortid: 'shortid',
  tls: 'tls'
}

const input = './index.js'

const plugins = [
  resolve(),
  commonjs(),
  builtins(),
  json(),
  babel({
    plugins: [
      ['@babel/plugin-transform-runtime', {
        helpers: false
      }]
    ],
    presets: [
      ['@babel/preset-env']
    ]
  })
]

export default [{
  input,
  external,
  output: {
    extend: true,
    file: 'dist/http.umd.js',
    format: 'umd',
    globals,
    name: 'scola.http'
  },
  plugins
}, {
  input,
  external,
  output: {
    file: 'dist/http.cjs.js',
    format: 'cjs',
    globals
  },
  plugins
}]
