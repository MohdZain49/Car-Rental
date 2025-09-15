import express from "express";
import verifyUser from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", verifyUser, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), verifyUser, addCar);
ownerRouter.get("/cars", verifyUser, getOwnerCars);
ownerRouter.post("/toggle-car", verifyUser, toggleCarAvailability);
ownerRouter.post("/delete-car", verifyUser, deleteCar);
ownerRouter.get("/dashboard", verifyUser, getDashboardData);
ownerRouter.post(
  "/update-image",
  upload.single("image"),
  verifyUser,
  updateUserImage
);

export default ownerRouter;
