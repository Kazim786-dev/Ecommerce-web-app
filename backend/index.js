import express from 'express'
// import mongoose from 'mongoose'
// import cors from 'cors'
import 'dotenv/config'

//routes
import userRouter from './routes/user/index.js'
import productRouter from './routes/product/index.js'
import categoryRouter from './routes/category/index.js'
import orderRouter from './routes/order/index.js'
import authRouter from './routes/auth/index.js'

import './config/database'
import ApplyMiddlewares from './middleware/index.js'
import {verifyuserloggedin} from './middleware/auth.js'

const app = express()

ApplyMiddlewares(app);

// getting environment variables
const {MONGO_URL,devPort}= process.env


app.use('/auth', authRouter)
app.use('/users', verifyuserloggedin, userRouter)
app.use('/products' ,productRouter)
app.use('/category', verifyuserloggedin ,categoryRouter)
app.use('/orders', verifyuserloggedin ,orderRouter)

// app.get('/', (req, res) => {
//   res.send('Hello Universe!')
// })

app.listen(devPort, () => {
  console.log(`Example app listening on port ${devPort}`)
})