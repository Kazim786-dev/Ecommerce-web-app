import express from 'express'
import 'dotenv/config'
//routes
import userRouter from './routes/user/index.js'
import productRouter from './routes/product/index.js'
import orderRouter from './routes/order/index.js'
import authRouter from './routes/auth/index.js'

import './config/database'
import authMiddleware from './middleware/auth'
import ApplyMiddlewares from './middleware/index.js'

const app = express()

ApplyMiddlewares(app);

// getting environment variables
const {devPort}= process.env


app.use('/auth', authRouter)
app.use('/users' ,userRouter)
app.use('/products' ,productRouter)
// app.use('/category',authMiddleware, categoryRouter)
app.use('/orders',authMiddleware ,orderRouter)

app.listen(devPort, () => {
  console.log(`Example app listening on port ${devPort}`)
})