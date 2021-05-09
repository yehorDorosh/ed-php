const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/index.php',
    createProxyMiddleware({
      target: 'http://localhost:7777',
      changeOrigin: true,
    })
  );
};