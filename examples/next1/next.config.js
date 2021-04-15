const deps = require("./package.json").dependencies;
const {
  withModuleFederation,
} = require("@module-federation/nextjs-mf");

module.exports = {
  future: { webpack5: true },
  webpack: (config, options) => {
    const { dev, isServer, webpack } = options;

    console.log(`Configuring webpack v${webpack.version} for ${config.target}:`);
    
    const mfConf = {
      mergeRuntime: true, // experimental flag is currently broken
      name: "next1",
      filename: (isServer && !dev ? "../" : "") + "static/runtime/remoteEntry.js",
      exposes: {
        "./exposedTitle": "./components/exposedTitle",
      },
      remotes: {},
      shared: {
        lodash: { eager: true, singleton: true, requiredVersion: deps.lodash },
        react: {
          singleton: true,
          eager: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
        "styled-jsx": {
          singleton: true,
        }
      }
    };

    if (!isServer) {
      config.output.publicPath = "http://localhost:3000/_next/";
    }

    withModuleFederation(config, options, mfConf);
    
    return config;
  },
  webpackDevMiddleware: (config) => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config;
  },
};
