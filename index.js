const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const { config } = require('./config/config');
const { routerApi } = require('./src/modules/routes');

const port = config.port || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

const whiteList = [config.urlFront];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


routerApi(app);


const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });


// app.use(logErrors);
// app.use(ormErrorHandler);
// app.use(boomErrorHandler);
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server run in PORT: ${port}`);
});
