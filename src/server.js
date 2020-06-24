import express from 'express'
import compression from 'compression'
import * as sapper from '@sapper/server'

const { PORT = 5000 } = process.env
const app = express()

app.use(
  compression({ threshold: 0 }),
  express.static('static'),
  sapper.middleware()
)

app.listen(PORT, err => {
  if (err) throw err
  console.log(`> Running on localhost:${PORT}`)
})
