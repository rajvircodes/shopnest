import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * @route { POST /api/auth/register }
 * @access { public }
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validate input fields exist ──
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    // ── Check if user already exists ──
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account already exists",
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("user register error", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route { POST /api/auth/login }
 * @access { public }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // find user by email

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password with
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "User login successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An internal server error occurred during login",
    });
  }
};

/**
 * @route { POST /api/auth/me }
 * @access { private }
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { register, login, getMe };
