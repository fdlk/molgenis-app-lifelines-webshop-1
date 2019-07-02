// vue.config.js
const i18n = require('./i18n.schemas.js')

module.exports = {
  filenameHashing: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/%40molgenis-app/lifelines-webshop/dist/'
    : '/',
  outputDir: 'dist',
  'devServer': {
    // In CI mode, Safari cannot contact "localhost", so as a workaround, run the dev server using the jenkins agent pod dns instead.
    host: process.env.JENKINS_AGENT_NAME || 'localhost',
    proxy: process.env.NODE_ENV === 'production' ? undefined : {
      '^/api': {
        'target': 'https://lifelines.dev.molgenis.org',
        'keepOrigin': true
      }
    },
    before: function (app, server) {
      app.get('/api/v2/i18n/lifelines-webshop/en', function (req, res) {
        res.json(i18n.en)
      })
      app.get('/api/v2/i18n/lifelines-webshop', function (req, res) {
        res.json(i18n.en)
      })
    }
  }
}
