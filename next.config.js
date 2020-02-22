/* eslint-disable import/no-extraneous-dependencies */
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require("next/constants");
const { extend, optional } = require("next-compose-plugins");
const { mergeWith, isArray, cloneDeep } = require("lodash");

const isSizeCheckBuild = ["browser", "server", "both"].includes(
  process.env.BUNDLE_ANALYZE
);
const isFullDevBuild = process.env.DEV_BUILD === "true";

const webpackConfig = (originalConfig, { isServer, dev }) => {
  const Path = require("path");
  const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
  const ExtractCSSChunksPlugin = require("extract-css-chunks-webpack-plugin");

  // uncomment to check on merge result
  // require('fs').writeFileSync(
  //   `${isServer ? 'server' : 'client'}.config.json`,
  //   JSON.stringify(config, null, '  ')
  // )
  const config = cloneDeep(originalConfig);

  config.output.futureEmitAssets = false;
  if (
    config.optimization &&
    config.optimization.minimizer &&
    !isServer &&
    !isSizeCheckBuild
  ) {
    for (let i = 0; i < config.optimization.minimizer.length; i += 1) {
      const plugin = config.optimization.minimizer[i];
      if (plugin.constructor.name === "TerserPlugin") {
        plugin.options.sourceMap = !isServer;
        break;
      }
    }
  }

  const webpackConf = {
    devtool:
      dev || isFullDevBuild
        ? "eval-source-map"
        : isServer
        ? "source-map"
        : "hidden-source-map",
    module: {
      rules: [
        {
          test: /module\.css$/i,
          use: [
            ...(isServer ? [] : [ExtractCSSChunksPlugin.loader]),
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true
              }
            },
            {
              loader: "resolve-url-loader",
              options: { root: Path.resolve(__dirname) }
            }
          ]
        },
        {
          test: /.*(?<!\.module).css$/i,
          use: [
            ...(isServer ? [] : [ExtractCSSChunksPlugin.loader]),
            "css-loader",
            {
              loader: "resolve-url-loader",
              options: { root: Path.resolve(__dirname) }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[contenthash:8].[ext]",
            outputPath: "static",
            publicPath: "/_next/static",
            emitFile: !isServer
          }
        }
      ]
    },
    plugins: [
      new ExtractCSSChunksPlugin({
        chunkFilename: `static/css/[name].[contenthash:8].css`,
        ignoreOrder: false
      })
    ],
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ["default", { discardComments: { removeAll: true } }]
          }
        })
      ]
    }
  };

  const afterMerge = mergeWith(config, webpackConf, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
    return undefined;
  });

  // uncomment to check on merge result
  // require('fs').writeFileSync(
  //   `${isServer ? 'server' : 'client'}.configAfter.json`,
  //   JSON.stringify(afterMerge, null, '  ')
  // )

  return afterMerge;
};

const distDir = "build";
const nextConfig = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  distDir,
  webpack: webpackConfig,
  // config to avoid hot module reloads caused by page inactivity
  onDemandEntries: {
    maxInactiveAge: 10 * 60 * 1000,
    pagesBufferLength: 3
  }
});

function timeStamp() {
  return new Date()
    .toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
    .replace(/[^0-9]/g, "");
}

function bundleAnalyzerConfig() {
  return {
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: "static",
        reportFilename: `../sizecheck/${timeStamp()}/server.html`,
        generateStatsFile: true
      },
      browser: {
        analyzerMode: "static",
        reportFilename: `../sizecheck/${timeStamp()}/client.html`,
        generateStatsFile: true
      }
    }
  };
}

module.exports = extend(nextConfig).withPlugins([
  [
    optional(() => require("@zeit/next-bundle-analyzer")),
    bundleAnalyzerConfig(),
    [PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD]
  ]
]);
