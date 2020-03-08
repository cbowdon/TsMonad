//	"build": "webpack --mode development lib/src/index.js -o dist/tsmonad.js --devtool source-map --output-library-target umd",

const path = require('path');

module.exports = {


  entry: './lib/src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tsmonad.js',
    libraryTarget: "umd",
    library: 'lib',
    umdNamedDefine: true,
    globalObject: 'this' //!!!This line
  },

  mode: 'development'
}

