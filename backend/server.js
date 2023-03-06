import colors from 'colors'
import express from 'express'
import data from './data.js'
import dotenv from "dotenv";
import cors from 'cors'
import connectDB from './config/db.js';
import seedRouter from './routes/seedRouter.js';
import productRouter from './routes/productRouter.js'
import userRouter from './routes/userRouter.js';
import errorHandler from './middleware/errorMiddleware.js';
import orderRouter from './routes/orderRouter.js';
dotenv.config();
connectDB()
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())

app.get('/api/keys/paypal', (req,res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); // sb stands for sandbox
})
app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/user', userRouter)
app.use('/api/orders', orderRouter)

app.use(errorHandler);



app.listen(PORT, () => {
  console.log(`serve at http://localhost:${PORT}`);
});