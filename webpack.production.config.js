const { json } = require('body-parser');
const path = require('path');
const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        main: './backend/src/server.js'
    },
    output: {
        path: path.join(__dirname, 'dist', 'backend'),
        publicPath: '/',
        filename: '[name].js',
        clean: true
    },
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        })]
    },
    externals: [nodeExternals()], // Exclude node_modules from the bundle
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './path/to/your/index.html', // Replace with the actual path to your index.html file
    //         filename: 'index.html',
    //         inject: 'body',
    //     }),
    // ],
    plugins: [
        new DefinePlugin({
            PORT                   : JSON.stringify(process.env.PORT),
            API_VERSION            : JSON.stringify(process.env.API_VERSION),
            UPLOAD_DIR             : JSON.stringify(process.env.UPLOAD_DIR),
            Encrypt_Decrypt_key    : JSON.stringify(process.env.Encrypt_Decrypt_key),
            IV                     : JSON.stringify(process.env.IV),
            CORS_ORIGIN            : JSON.stringify(process.env.CORS_ORIGIN),
            SOULSHARE_USER         : JSON.stringify(process.env.SOULSHARE_USER),
            HOST                   : JSON.stringify(process.env.HOST),
            DATABASE               : JSON.stringify(process.env.DATABASE),
            PASSWORD               : JSON.stringify(process.env.PASSWORD),
            DBPORT                 : JSON.stringify(process.env.DBPORT),
            TIMEZONE               : JSON.stringify(process.env.TIMEZONE),
            ACCESS_TOKEN_SECRET    : JSON.stringify(process.env.ACCESS_TOKEN_SECRET),
            REFRESH_TOKEN_SECRET   : JSON.stringify(process.env.REFRESH_TOKEN_SECRET),
            NODE_ENV               : JSON.stringify(process.env.NODE_ENV),
        })
    ]
};