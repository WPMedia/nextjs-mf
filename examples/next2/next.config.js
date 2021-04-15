const deps = require("./package.json").dependencies;
const path = require("path");
const {
  withModuleFederation,
} = require("@module-federation/nextjs-mf");

module.exports = {
  future: { webpack5: true },
  webpack: (config, options) => {
    const { isServer, webpack } = options;

    console.log(`Configurating webpack v${webpack.version} for ${config.target}:`);

    const mfConf = {
      name: "next2",
      remotes: {
        // Add a remote pointing at the other app
        next1: isServer
          ? path.resolve(
              __dirname,
              "../next1/.next/server/static/runtime/remoteEntry.js"
            )
          : "next1",
      },
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

    withModuleFederation(config, options, mfConf);

    if (!isServer) {
      config.output.publicPath = "http://localhost:3001/_next/";
    }

    return config;
  },

  webpackDevMiddleware: (config) => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config;
  },
};
