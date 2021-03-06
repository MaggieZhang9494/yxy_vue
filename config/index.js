'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/mgr':{
                target:'http://10.6.5.173:5000',//
                changeOrigin:true,
                pathRewrite:{
                    '^/mgr':'/mgr'
                }
            },
            '/api':{
                target:'http://10.6.5.173:8104',//
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
			},
			// '/mgr':{
            //     target:'http://10.6.5.190:80',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/mgr':'/mgr'
            //     }
            // },
            // '/api':{

            //     target:'http://10.6.5.190:80',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/api':''
            //     }
			// },

			//252
			// '/mgr':{
            //     target:'http://test.you.xin:5021',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/mgr':'/mgr'
            //     }
            // },
            // '/api':{

            //     target:'http://test.you.xin:8107',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/api':''
            //     }
			// },

			// '/mgr':{
            //     target:'http://demo.weinbc.com:5000',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/mgr':'/mgr'
            //     }
            // },
            // '/api':{

            //     target:'http://demo.weinbc.com:8106',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/api':''
            //     }
			// },

			// '/mgr':{
            //     target:'http://www.you.xin:80',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/mgr':'/mgr'
            //     }
            // },
            // '/api':{

            //     target:'http://www.you.xin:8104',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/api':''
            //     }
			// },

			// '/mgr':{
            //     target:'http://origin.you.xin:80',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/mgr':'/mgr'
            //     }
            // },
            // '/api':{

            //     target:'http://origin.you.xin:8104',//
            //     changeOrigin:true,
            //     pathRewrite:{
            //         '^/api':''
            //     }
			// },
        },

        // Various Dev Server settings
        host: '10.6.5.222', // can be overwritten by process.env.HOST
        port: 8085, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        env: require('./prod.env'),

        // Template for index.html
        index: path.resolve(__dirname, '../pro/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../pro'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}
