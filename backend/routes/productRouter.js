import express from "express";
import Product from "../models/ProductModel.js";
import expressAsyncHandler from 'express-async-handler'

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

const PAGE_SIZE = 3;
productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

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
