import Document, { Html, Head, Main, NextScript } from "next/document";
const sharePatch = require("@module-federation/nextjs-mf/patchSharing");

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        {sharePatch()}
        {/* next line only necessary if mergeRuntime: false in other app */}
        {/* <script data-webpack="next1" src="http://localhost:3000/_next/static/chunks/webpack.js" /> */}
        <script data-webpack="next1" src="http://localhost:3000/_next/static/runtime/remoteEntry.js" />
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
