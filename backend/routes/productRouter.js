import express from "express";
import Product from "../models/ProductModel.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
     const products = await Product.find();
     return res.status(200).json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg : "Internal Server Error"}) 
  }
});

productRouter.get("/product/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (product) {
      return res.status(200).json(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});
productRouter.get("/:id", async (req, res) => {
 try {
    const {id} = req.params
     const product = await Product.findById(id);
     if (product) {
       return res.status(200).json(product);
     } else {
       res.status(404).send({ message: "Product Not Found" });
     }
 } catch (error) {
    console.log(error);
    return res.status(500).json({
        msg : "Internal Server Error"
    })
 }
});

export default productRouter;
