const express = require('express');

express()
  .get('/', (req, res) => res.status(200).json({ result: 'success' }))
  .listen(process.env.PORT || 8080);
