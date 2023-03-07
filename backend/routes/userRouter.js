import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken,isAuth } from "../config/util.js";


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


userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);


export default userRouter;
