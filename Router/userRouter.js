import express from "express";
import { getUserByName, createUser, sendMailToResetPassword } from "../helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.route("/register").post(async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const user = await createUser(username, password);
  if(user.message){
      res.status(400).send(user.message)
  }
  else {
      res.send(user);
  }  
});

router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByName({ username: username });
  if (user) {
    const passwordFromDB = user.hashedPassword;
    console.log(user, password, passwordFromDB);
    const isPasswordMatch = await bcrypt.compare(password, passwordFromDB);

    if (isPasswordMatch) {
      const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      console.log(jwtToken);
      res.send({ message: "successful login", jwtToken });
    } else {
      res.status(400).send({ message: "invalid credentials" });
    }
  } else {
    res.status(400).send({ message: "invalid credentials" });
  }
});

router.route("/forgot-password").post(async (req, res) => {
  const { username } = req.body;
  const user = await getUserByName({ username: username });
  if(user){
    console.log("user is available")
    const token = jwt.sign(user._id,process.env.SECRET_KEY)
    let link = process.env.FRONT_END_URL+username+"/"+token
    console.log(link)
    sendMailToResetPassword(username,link)
    res.send({message : "password reset link is sent to your email"})
  }
  else {
    res.send({message : "user not registered"})
  }
})

router.route("/reset-password").post(async(req,resp) => {
    const {username, password} = req.body;
    const user = await updatePassword({username, password});
    resp.send({message : "password changed successfully"});
})
export const userRouter = router;
