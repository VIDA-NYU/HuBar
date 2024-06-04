// webpack.config.js

const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js', // Entry point for your main app
        lasso: './src/lasso.js', // Entry point for lasso function
    },
    output: {
        filename: '[name].bundle.js', // Output bundle names will correspond to entry names
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            "fs": false
        },
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname),
          },
          compress: true,
          port: 8000,
          hot: true, // Enabling HMR
      },
      mode: 'development', // Ensure the mode is set to development for dev server
};