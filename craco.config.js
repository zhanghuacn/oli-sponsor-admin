const CracoLessPlugin = require("craco-less-fix");
const path = require("path");
const webpack = require('webpack')

const dotenvLoad = require('dotenv-load');
dotenvLoad();

process.env.BROWSER = "none";
process.env.PORT = "8043";

function getPublicEnvVariables() {
  const variables = {}

  for(const k in process.env) {
    if(/^CHARITY_PUBLIC/.test(k)) {
      variables[k] = JSON.stringify(process.env[k])
    }
  }

  return variables
}


module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://yapi.valsn.com/mock/45/sponsor',
        // target: 'https://dev-api.olicharity.org/sponsor',
        // target: 'https://85de-183-14-215-216.ngrok.io/sponsor',
        changeOrigin: true,
        pathRewrite: {
          "^/api": '/'
        },

      }
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ context, webpackConfig, pluginOptions }) => {
          // aws-sdk config
          webpackConfig.resolve.fallback = {
            ...(webpackConfig.resolve.fallback || {}),
            util: false
          }

          // antd config
          pluginOptions = pluginOptions || {};
          const modifyVars = {};

          if (pluginOptions.customizeTheme) {
            Object.assign(modifyVars, pluginOptions.customizeTheme);
          }

          const lessLoaderOptions = pluginOptions.lessLoaderOptions || {};
          lessLoaderOptions.lessOptions = lessLoaderOptions.lessOptions || {};
          if (lessLoaderOptions.lessOptions.modifyVars) {
            Object.assign(modifyVars, lessLoaderOptions.lessOptions.modifyVars);
          }

          lessLoaderOptions.lessOptions.modifyVars = modifyVars;
          // javascriptEnabled: true is suggested in the Ant Design docs:
          // https://ant.design/docs/react/customize-theme#Customize-in-webpack
          lessLoaderOptions.lessOptions.javascriptEnabled = true;

          return CracoLessPlugin.overrideWebpackConfig({
            context,
            webpackConfig,
            pluginOptions: {
              styleLoaderOptions: pluginOptions.styleLoaderOptions || {},
              cssLoaderOptions: pluginOptions.cssLoaderOptions || {},
              postcssLoaderOptions: pluginOptions.postcssLoaderOptions || {},
              lessLoaderOptions,
              modifyLessRule: pluginOptions.modifyLessRule,
              miniCssExtractPluginOptions:
                pluginOptions.miniCssExtractPluginOptions || {},
            },
          });
        },
        overrideCracoConfig: ({ cracoConfig, pluginOptions }) => {
          if (!cracoConfig.babel) cracoConfig.babel = {};
          if (!cracoConfig.babel.plugins) cracoConfig.babel.plugins = [];

          const babelPluginImportOptions = {
            libraryName: "antd",
            libraryDirectory: "lib",
            style: true,
          };
          if (pluginOptions && pluginOptions.babelPluginImportOptions) {
            Object.assign(
              babelPluginImportOptions,
              pluginOptions.babelPluginImportOptions
            );
          }
          // Use `style: 'css'` to include the precompiled CSS.
          // `style: true` loads the original Less so that variables can be modified.
          // See: https://github.com/DocSpring/craco-antd/issues/3
          cracoConfig.babel.plugins.push(["import", babelPluginImportOptions]);
          return cracoConfig;
        },
      },
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        babelPluginImportOptions: {
          libraryDirectory: "es",
        },
      },
    }, {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@primary-color': '#201f1e',
              '@success-color': '#52c41a',
              '@warning-color': '#e0bb7c',
              '@error-color': '#e24d31',
              '@heading-color': '#201f1e',
              '@text-color': '#5a5855',
              '@text-color-secondary': '#a6a39e',
              '@border-color-split': '#dbdad8',
              '@menu-item-active-bg': '@warning-color',
              '@menu-dark-bg': '@primary-color',
              '@menu-dark-submenu-bg': '@primary-color',
              '@menu-dark-inline-submenu-bg': '@primary-color',
              '@menu-popup-bg': '@primary-color',
              '@layout-header-background': '@primary-color',
              '@layout-trigger-background': '@primary-color',
              '@rate-star-color': '#e0bb7c',
              "@select-item-selected-bg": '#f5f5f5',
              "@calendar-item-active-bg": '#f5f5f5',
              "@primary-1": '#f5f5f5'
            }
          },
        },
        modifyLessModuleRule(rule) {
          const pathSep = path.sep

          for(const ruleOrLoader of rule.use) {
            if (ruleOrLoader.loader.includes(`${pathSep}css-loader${pathSep}`)) {
              ruleOrLoader.options.modules = {
                localIdentName: '[path]_[local]-[hash:base64:5]',
                exportLocalsConvention: "camelCase"
              }
              break
            }
          }

          return rule
        }
      },
    },
  ],
  webpack: {
    plugins: [
      new webpack.DefinePlugin(getPublicEnvVariables())
    ]
  }
}