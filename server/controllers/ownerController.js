import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import Car from "../models/Car.js";
import fs from "fs";
import Booking from "../models/Booking.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    user.role = "owner";
    await user.save();

    return res.json({
      success: true,
      message: "Role changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Image file is required",
      });
    }

    // upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
    });

    return res.json({
      success: true,
      message: "Car added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const owner = req.user?._id;
    if (!owner) {
      return res.json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const cars = await Car.find({ owner });

    return res.json({
      success: true,
      cars,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: "false",
      message: error.message,
    });
  }
};

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (car.owner.toString() !== _id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized request",
      });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    return res.json({
      success: true,
      message: "Availability Toggle",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: "false",
      message: error.message,
    });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (car.owner.toString() !== _id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized request",
      });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    return res.json({
      success: true,
      message: "Car Removed",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: "false",
      message: error.message,
    });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = (await Booking.find({ owner: _id }).populate("car")).sort({
      createdAt: -1,
    });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });

    const completedBooking = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => (booking.status = "confirmed"))
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBooking: completedBooking.length,
      recentBooking: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const imageFile = req.file;

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Image file is required",
      });
    }

    // upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id, { image });

    return res.json({
      success: true,
      message: "Image Updated",
    });

    
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
