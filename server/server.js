import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter)
app.use('/api/booking', bookingRouter)

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`server is listening on http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(error));
