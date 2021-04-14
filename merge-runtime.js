const ConcatSource = require("webpack-sources/lib/ConcatSource");
const Compilation = require("webpack/lib/Compilation");

const PLUGIN_NAME = "EnableSingleRunTimeForFederationPlugin";

/**
 * Merge the webpack runtime with your remote entry.
 */
module.exports = class EnableSingleRunTimeForFederationPlugin {
  /**
   * @param {object} options
   * @param {string} [options.filename] The file name to concat the runtime with
   */
  constructor(options) {
    this._options = options;
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    const { filename } = this._options;

    if(!filename){
      throw new Error(`${PLUGIN_NAME}: options.filename is required.`);
    }

    // Specify the event hook to attach to
    compiler.hooks.thisCompilation.tap(
      PLUGIN_NAME,
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: PLUGIN_NAME,
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          (assets) => {
            Object.keys(assets).forEach((asset) => {
              if (asset.includes("static/chunks/webpack")) {
                compilation.updateAsset(
                  filename,
                  new ConcatSource(
                    compilation.getAsset(asset).source.buffer().toString(),
                    compilation.getAsset(filename).source.buffer().toString()
                  )
                );
              }
            });
          }
        );
      }
    );
  }
};