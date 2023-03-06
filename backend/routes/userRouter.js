import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken } from "../config/util.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password filed is requred");
    }
    const user = await User.findOne({ email });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post("/signup", expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password){
    throw new Error("FIll All fields")
  }
  const userExist = await User.findOne({email})
  if(userExist){
    throw new Error('user is Already Exist')
  }
  try {
    const hasedPassword = bcrypt.hashSync(password)
    const user = await User.create({ name, email, password : hasedPassword});
     return res.status(200).json({
       _id: user._id,
       name: user.name,
       email: user.email,
       isAdmin: user.isAdmin,
       token: generateToken(user),
     });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg : "Internal Server Error"
    })
  }
}));

export default userRouter;
