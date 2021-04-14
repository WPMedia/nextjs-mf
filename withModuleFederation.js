const path = require("path");
const MergeRuntime = require("./merge-runtime");
const nextServerRemote = (remoteObject) => {
  if (!typeof remoteObject === "object") {
    throw new Error("Remotes must be configured as an object");
  }
  return Object.entries(remoteObject).reduce((acc, [name, config]) => {
    acc[name] = {
      external: `external new Promise(res => {
      let remote
      try {
      remote = require('${config}')['${name}']
      } catch (e) {
      delete require.cache['${config}']
      remote = require('${config}')['${name}']
      }
      const proxy = {get:(request)=> remote.get(request),init:(arg)=>{try {return remote.init(arg)} catch(e){console.log('remote container already initialized')}}}
      res(proxy)
      })`,
    };
    return acc;
  }, {});
};

const withModuleFederation = (config, options, mfConfig) => {

  if (!options.webpack.container) {
    throw new Error("Module Federation only works with Webpack 5");
  }

  // Top-Level Await is required for this to work
  config.experiments = { topLevelAwait: true };

  // For some reason chunk-splitting causes an error
  if(mfConfig.exposes){
    config.optimization.splitChunks = false;
  }

  if (!options.isServer) {
    config.output.library = mfConfig.name;

    config.externals = {
      react: "React",
      // ReactDOM: "ReactDOM"
    };
  } else {
    config.externals = {
      react: path.resolve(__dirname, "./react.js"),
      // "react-dom": path.resolve("./react-dom.js"),
    };
  }

  const federationConfig = {
    // defaults
    name: mfConfig.name || "remote",
    library: { type: config.output.libraryTarget, name: (mfConfig.name || "remote") },
    filename: "static/runtime/remoteEntry.js",
    exposes: {},
    remotes: {},
    shared: [],
    // merge config
    ...mfConfig
  };

  // Remove config elements only used by this plugin
  delete federationConfig.mergeRuntime;

  if(options.isServer){
    // override remotes when running in a server
    federationConfig.remotes = nextServerRemote(federationConfig.remotes);
  }

  config.plugins.push(
    new options.webpack.container.ModuleFederationPlugin(federationConfig)
  );

  if (mfConfig.mergeRuntime) {
    config.plugins.push(new MergeRuntime(federationConfig));
  }
};

module.exports = withModuleFederation;
