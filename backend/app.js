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
app.get("/api/products/product/:slug", (req, res) => {
  const {slug} = req.params
  const product = data.products.find(pro => pro.slug === slug)
  if(product){
    return res.status(200).json(product)
  }
  else{
    return res.status(404).json({msg : "Product Not Found"})
  }
});



app.listen(PORT, () => {
  console.log(`serve at http://localhost:${PORT}`);
});