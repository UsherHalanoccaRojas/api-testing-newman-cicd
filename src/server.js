const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Task Management API is running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` Endpoints:    http://localhost:${PORT}/api/tasks`);
  console.log(`===============================================`);
});

module.exports = server;

