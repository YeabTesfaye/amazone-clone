import expess from 'express'
import data from './data.js'
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();
const PORT = process.env.PORT || 5000

const app = expess()
app.use(cors())
app.get('/api/products', (req,res) => {
    res.send(data.products)
})


app.listen(PORT, () => {
  console.log(`serve at http://localhost:${PORT}`);
});