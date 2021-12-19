const withSass = require("@zeit/next-sass");
const withFonts = require("next-fonts");


module.exports = withSass(withFonts({
  env: {
    REACT_APP_API_URL: 'http://localhost:8000/api',
 },
  cssModules: false,
  enableSvg: true,
  webpack (config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    })
    return config
  }
}))
