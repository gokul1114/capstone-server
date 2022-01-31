import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./Router/userRouter.js";
import { bikeRouter } from "./Router/bikeRouter.js";

const app = express();
dotenv.config()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 9000;
const MONGO_URL = process.env.MONGO_URL;
const SECRET_KEY = process.env.SECRET_KEY

async function createConnection() {
 const client =  new MongoClient(MONGO_URL);
 await client.connect()
 return client
}

export const client = await createConnection();

app.use("/user", userRouter)
app.use("/bike", bikeRouter)

app.get("/",(req,resp)=>{
    resp.send("Hello World")
})

app.listen(PORT,() => {console.log("server started")})
