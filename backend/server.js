import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRouter from './routes/auth.routes.js'

dotenv.config();
connectDB()

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use('/api/auth',authRouter)

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopNest API is running",
    environment: process.env.NODE_ENV,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} Not found!`,
  });
  success: (false, status);
});

app.use((err, req, res, next) => {
  console.error("server error", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`);
});