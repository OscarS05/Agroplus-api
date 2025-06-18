const { config } = require('./config/config');
const createApp = require('./app');

(async () => {
  const port = config.port || 3000;
  const app = await createApp();

  app.listen(port, () => {
    console.info(`Server run in PORT: ${port}`);
  });
})();
