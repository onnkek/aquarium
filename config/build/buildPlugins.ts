import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BuildOptions } from './types/config';

export default function buildPlugins({ paths, isDev, apiUrl, project, version }: BuildOptions): webpack.WebpackPluginInstance[] {

  const plugins: webpack.WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
      template: paths.html,
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css',
    }),
    new webpack.DefinePlugin({
      __IS_DEV__: JSON.stringify(isDev),
      __API__: JSON.stringify(apiUrl),
      __PROJECT__: JSON.stringify(project),
      __APP_VERSION__: JSON.stringify(version)
    }),
    new CopyPlugin({
      patterns: [
        { from: paths.public + "/favicon.ico", to: paths.build },
        { from: paths.public + "/manifest.json", to: paths.build }
      ]
    }),
    // new CircularDependencyPlugin({ 
    //   exclude: /node_modules/,
    //   failOnError: true
    // }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ];

  if (isDev) {
    plugins.push(new ReactRefreshWebpackPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
    // plugins.push(new BundleAnalyzerPlugin({
    //   openAnalyzer: false
    // }));
  }



  return plugins;
}