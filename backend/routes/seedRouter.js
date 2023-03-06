import express from 'express'
import Product from '../models/ProductModel.js'
import data from '../data.js'
import User from '../models/UserModel.js'
const seedRouter = express.Router()

seedRouter.get('/', async(req,res) => {
    await Product.deleteMany({})
    const createdProduct = await Product.insertMany(data.products)

    const createdUsers = await User.insertMany(data.users)
    return res.status(201).json({createdProduct, createdUsers})
})

export default seedRouter