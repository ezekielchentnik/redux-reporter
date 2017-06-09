import buble from 'rollup-plugin-buble'
let pkg = require('./package.json')

export default {
  exports: 'named',
  entry: 'src/main.js',
  targets: [{
    dest: pkg['main'],
    format: 'umd',
    moduleName: 'reduxReporter'
  }, {
    dest: pkg['jsnext:main'],
    format: 'es'
  }],
  plugins: [
    buble()
  ]
}
