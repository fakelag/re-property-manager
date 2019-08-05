import HtmlWebpackPlugin = require('html-webpack-plugin');
import path = require('path');
import TerserWebpackPlugin = require('terser-webpack-plugin');
import webpack = require('webpack');

module.exports = (env: { NODE_ENV: string }): webpack.Configuration => {
	const cssLoader: string[] = ['style-loader', 'css-loader', 'sass-loader'];
	const isProduction: boolean = (env.NODE_ENV === 'production');
	const root: string = path.resolve(__dirname);

	console.log('Webpack env: ', env.NODE_ENV);
	console.log('Webpack root: ', root);

	return {
		context: root,
		devtool: (isProduction ? undefined : 'cheap-module-source-map'),
		entry: [
			path.join(root, '/index.js'),
		],
		mode: isProduction ? 'production' : 'development',
		module: {
			rules: [
				{
					test: /\.(scss|css)$/,
					use: cssLoader,
				},
				{
					exclude: /(node_modules)/,
					test: /.js$/,
					use: {
						loader: 'babel-loader',
					},
				},
				{
					test: /\.(gif|ttf|eot|svg|png|jpg|jpeg|woff2?)$/,
					use: 'url-loader?name=[name].[ext]',
				},
			],
		},
		output: {
			filename: 'bundle.js',
			path: path.join(root, '/bundle/' + (isProduction ? 'prod' : 'dev')),
			publicPath: '/',
			sourceMapFilename: 'bundle.js.map',
		},
		plugins: (isProduction ? [
			new HtmlWebpackPlugin({
				filename: 'index.html',
				inject: true,
				template: path.join(root, '../index.html'),
			}),
			new TerserWebpackPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					keep_classnames: false,
					keep_fnames: false,
					mangle: true,
					toplevel: false,
				},
			}),
		] : [
			new HtmlWebpackPlugin({
				filename: 'index.html',
				inject: true,
				template: path.join(root, '../index.html'),
			}),
		]).concat([ /* Shared plugins */
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(env.NODE_ENV),
				},
			}),
		]),
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.json'],
		},
	};
};
