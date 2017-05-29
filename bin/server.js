'use strict'
const express = require('express')
const app = express()

app.use('/', express.static(require('path').join(__dirname, '..', 'public')))

app.listen('2001', function () {
  return console.log(`Server listening on port 2001`)
})
