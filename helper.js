import { client } from "./index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import  nodemailer  from "nodemailer";
import  SendGridTransport  from "nodemailer-sendgrid-transport";

export async function getUserByName(query) {
  console.log(query);
  const user = await client
    .db("BikeRentals")
    .collection("Users")
    .findOne(query);
  return user;
}

export async function getHashedPassword(password) {
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt)
   return hashedPassword
}

export async function createUser(username, password) {
  const hashedPassword = await getHashedPassword(password);
  const user = await getUserByName({ username });
  if (user) {
    console.log("username already in use");
    return { message: "username already in use" };
  } else {
    const users = await client
      .db("BikeRentals")
      .collection("Users")
      .insertOne({ username, hashedPassword });
    return users;
  }
}


export async function getBikes({ startDate, endDate, location }) {
  const bikes = await client
    .db("BikeRentals")
    .collection("Bikes")
    .find({ location, isAvailable: 1 })
    .toArray();
  return bikes;
}

export async function submitOrder(query) {
  const order = await client
    .db("BikeRentals")
    .collection("OrderDetails")
    .insertOne(query);
}

export async function updateBikeAvailability() {
   const bike = await client
     .db("BikeRentals")
     .collection("Bikes")
     .updateOne(
       { _id: new ObjectId(id) },
       { $set: { isAvailable: 0, bookedSlots: [{ startDate, endDate }] } }
     );
     return bike
 }
 
const transporter = nodemailer.createTransport(SendGridTransport({
   auth:{
       api_key:process.env.SENDGRID_API
   }
 }))

 export function sendOrderConfirmationMail(to) {
   transporter.sendMail({
     to:to,
     from:"eshwarchamp@gmail.com",
     subject:"Order Conformed",
     html:`<h1>Your order is successfull</h1>`
 }).then(r => console.log(r))
 }

 export function sendMailToResetPassword(to,link) {
   transporter.sendMail({
      to:to,
      from:"eshwarchamp@gmail.com",
      subject:"Reset Password",
      html:`<h1>You can reset your password at ${link}</h1>`
  }).then(r => console.log(r))
 }

 export async function updatePassword({username, password}){
  const hashedPassword = await getHashedPassword(password);
  const update = client
  .db("BikeRentals")
  .collection("Users")
  .updateOne({username : username},{$set : {hashedPassword : hashedPassword}})
 }