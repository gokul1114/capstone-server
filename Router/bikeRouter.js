import express from "express";
import { getBikes, submitOrder, updateBikeAvailability, sendOrderConfirmationMail } from "../helper.js";
const router = express.Router();

router
.route("/getBikes")
.post(async(req, res) => {
    const {startTime, endTime, location} = req.body;
    const bikes = await getBikes({startTime, endTime, location})
    res.send(bikes)
})

router
.route("/completeOrder")
.post(async(req,res) => {
    const order = await submitOrder(req.body)
    updateBikeAvailability()
    sendOrderConfirmationMail()
    res.send({message : 'Order Placed'})
})
export const bikeRouter = router;