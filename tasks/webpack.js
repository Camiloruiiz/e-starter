import path from 'path'
import webpack from 'webpack'
import process from 'process'
import merge from 'webpack-merge'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

// to-do
const isEnv = process.env.NODE_ENV
const isWp = (process.env.NODE_ENV === 'wp')
const isProduction = (process.env.NODE_ENV === 'production' || isWp)
let outputPath = isWp ? '../' : '../public_html/'

console.log(
  `Running webpack in the ${isEnv} mode`
)

let webpackConfig = {
  context: path.resolve(__dirname, '../src/'),
  entry: {
    main: [
      './assets/javascripts/application.js',
      './assets/javascripts/bootstrap.js'
    ]
  },
  output: {
    filename: isProduction ? 'static/js/[name].min.js' : 'static/js/[name].js',
    path: path.resolve(__dirname, outputPath),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader, {
            // $to-to 4
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            } // translates CSS into CommonJS
          }, {
            loader: 'postcss-loader',
            options: {
              config: { path: __dirname },
              sourceMap: true
            }
          },
          // resolve-url-loader may be chained before sass-loader if necessary
          { loader: 'resolve-url-loader', options: { sourceMap: true } },
          {
            loader: 'sass-loader',
            options: { sourceMap: true } // compiles Sass to CSS
          }]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          // limit: 50000,
          // Todo separate by differents mimetype
          // mimetype: 'application/font-woff',
          // Todo try to change the context to make the url like ../fonts instead of ../../static/fonts/
          name: './static/fonts/[name].[ext]', // Output below ./fonts
          publicPath: '../../' // Take the directory into account
        }
      },
      // include pug-loader to process the pug files
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.js$/,
        // include: path.resolve(__dirname, '../src'),
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['env', {
              modules: false,
              useBuiltIns: true
            }]],
            plugins: ['syntax-dynamic-import'],
            cacheDirectory: true,
            babelrc: false
          }
        }]
      },
      // eslint options
      {
        // This will apply the loader before the other ones
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, '../src/assets/javascripts')],
        options: {
          // eslint options (if necessary)
          fix: true
        }
      },
      // compresses images
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/images/[name].[ext]'
              // publicPath: '../../' // Take the directory into account
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // webpack@2.x and newer
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                optimizationLevel: 5
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: true
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              },
              svgo: {
                plugins: [
                  { removeViewBox: true },
                  { cleanupIDs: false }
                ]
              }
            }
          }
        ],
        // This will apply the loader before the other ones
        enforce: 'pre'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProduction ? 'static/css/[name].min.css' : 'static/css/[name].css',
      chunkFilename: isProduction ? 'static/css/[id].min.css' : 'static/css/[id].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // In case you imported plugins individually, you must also require them here:
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover'
    })
  ]
}

if (!isWp) {
  webpackConfig = merge.smart(webpackConfig, {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Home',
        inject: true,
        template: './views/pages/index.pug',
        filename: '../public_html/index.html',
        chunks: ['main', 'vendor'],
        alwaysWriteToDisk: true
      })
    ]
  })
}

module.exports = { webpackConfig }
