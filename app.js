const express = require('express')
const app = express()
const apiRouter = require('./routes/api-router.js');
const { handleInternalErrors } = require('./errors/error-handling.js');

app.use(express.json());

app.use('/api', apiRouter)
app.use(handleInternalErrors)

module.exports = app