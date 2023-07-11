const express = require('express')
const app = express()

//env 
require('dotenv').config()

const devPort = process.env.devPort

app.get('/', (req, res) => {
  res.send('Hello Universe!')
})

app.listen(devPort, () => {
  console.log(`Example app listening on port ${devPort}`)
})