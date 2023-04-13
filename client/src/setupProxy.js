const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log("MIDDLEWARE SEtup")
    app.use(
        '/api/*',
        createProxyMiddleware({
            target: 'http://localhost:5001',
            changeOrigin: true,
        })
    );
};
