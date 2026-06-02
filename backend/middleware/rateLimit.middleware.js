import rateLimit from "express-rate-limit";

// Limit product creation to 3 requests per minute per IP address
const productCreationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, 
  message: {
    success: false,
    message: "Too many products created from this IP, please try again after a minute."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default productCreationLimiter