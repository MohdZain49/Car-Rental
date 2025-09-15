import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBookings,
  getUserBookings,
} from "../controllers/bookingController.js";
import verifyUser from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);
bookingRouter.post("/create", verifyUser, createBooking);
bookingRouter.get("/user", verifyUser, getUserBookings);
bookingRouter.get("/owner", verifyUser, getOwnerBookings);
bookingRouter.post("/change-status", verifyUser, changeBookingStatus);

export default bookingRouter;
