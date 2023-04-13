const { createProxyMiddleware } = require('http-proxy-middleware');

// This is needed to get redirect working in development env for CAS login

module.exports = function(app) {
    console.log("MIDDLEWARE SETUP")
    app.use(
        '/api/*',
        createProxyMiddleware({
            target: 'http://localhost:5001',
            changeOrigin: true,
        })
    );
};
