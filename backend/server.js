import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.routes.js'
import ProductRoutes from './routes/product.routes.js'

dotenv.config();
connectDB()

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'https://shopnest-gray.vercel.app',
    'https://shopnest-git-main-rajvirsinh-gohil-s-projects.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(morgan("dev"));


app.use('/api/auth',authRoutes)
app.use('/api/products',ProductRoutes)

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
    success: false,
  });
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