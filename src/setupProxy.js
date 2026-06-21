const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_TRANSLATE_API || 'http://localhost:5000';

module.exports = function (app) {
  // Proxy /api/* to a local backend server in development.
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
