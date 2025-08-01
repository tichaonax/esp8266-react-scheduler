const pkg = require('../package.json');
const { createProxyMiddleware } = require('http-proxy-middleware');
const target = process.env.PROXY || pkg.proxy;

module.exports = function (app) {
  // Proxy REST API calls
  app.use(
    createProxyMiddleware('/rest', {
      target,
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.log('REST Proxy Error:', err.message);
      }
    })
  );
  
  // Proxy WebSocket connections
  app.use(
    createProxyMiddleware('/ws', {
      target: target.replace(/^http(s?):\/\//, "ws$1://"),
      ws: true,
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.log('WebSocket Proxy Error:', err.message);
      },
      onProxyReqWs: (proxyReq, req, socket) => {
        console.log('WebSocket proxy request to:', proxyReq.path);
      }
    })
  );
};
