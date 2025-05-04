const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const swaggerUI = require('swagger-ui-express');
const specs = require('./src/utils/docs/swagger');

const { config } = require('./config/config');
const { logErrors, ormErrorHandler, boomErrorHandler, errorHandler } = require('./src/middlewares/error.handler');
const { routerApi } = require('./src/modules/routes');

const app = express();
const port = config.port || 3000;

app.use(express.json());
app.use(cookieParser());

// const whiteList = [config.urlFront];

app.use(cors({
  // origin: (origin, callback) => {
  //   if (!origin || whiteList.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  credentials: true,
}));


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server run in PORT: ${port}`);
});
