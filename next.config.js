/**
 * @type {import('next').NextConfig}
 */
let config = {
  images: {
    loader: "custom"
  },
  compiler: {
    styledComponents: true
  },
  reactStrictMode: true,
  experimental: {
    modularizeImports: {
      "react-bootstrap": {
        transform: "react-bootstrap/{{member}}",
        preventFullImport: true
      },
      lodash: {
        transform: "lodash/{{member}}",
        preventFullImport: true
      }
    }
  }
}

if (process.env.BUNDLE_ANALYZER === "true") {
  config = require("@next/bundle-analyzer")({ enabled: true })(config)
}

module.exports = config
