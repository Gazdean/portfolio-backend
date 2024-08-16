const express = require('express')
const app = express()
const apiRouter = require('./routes/api-router.js');
const { handleInternalErrors, handleCustomErrors, handlePsqlErrors } = require('./errors/error-handling.js');

app.use(express.json());

app.use('/api', apiRouter)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleInternalErrors)

module.exports = app