module.exports = {
  devServer: {
    allowedHosts: ['localhost', '.localhost'],
    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}; 