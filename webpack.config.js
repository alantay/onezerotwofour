var webpack = require('webpack');
var path = require('path');

module.exports = {
    // devtool: 'inline-source-map',
    devtool: 'cheap-module-source-map',
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:8080',
        'webpack/hot/only-dev-server',
        './src'
    ],
    output:{
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve:{
        modules:['node_modules','src'],
        extensions:['','.js']
    },
    module:{
        loaders:[{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders:['react-hot', 'babel?presets[]=react,presets[]=es2015']

        },

        {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader",  "postcss-loader", "sass-loader"]
        }
        ]
    },
    sassLoader: {
      includePaths: [__dirname]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        require('autoprefixer'),
        new webpack.DefinePlugin({ // <-- key to reducing React's size
             'process.env': {
               'NODE_ENV': JSON.stringify('production')
             }
           }),
           new webpack.optimize.DedupePlugin(), //dedupe similar code 
           new webpack.optimize.UglifyJsPlugin(), //minify everything
           new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
    ]
}