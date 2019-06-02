const cors = require('cors');
const express = require('express');
const routes = require('./routes/index');

const app = express();

app.use(cors())
  .get('/', (req, res) => res.status(200).json({ result: 'success' }))
  .use('/api', routes)
  .listen(process.env.PORT || 8080);
