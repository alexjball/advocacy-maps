/**
 * @type {import('next').NextConfig}
 */
const config = {
  images: {
    loader: "custom"
  },
  compiler: {
    styledComponents: true
  },
  eslint: {
    dirs: ["pages", "components", "functions/src", "tests"]
  },
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en"
  }
}

module.exports = {
  ...config
}
