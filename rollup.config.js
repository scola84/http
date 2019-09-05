const plugins = require('@scola/worker/rollup.plugins')

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
