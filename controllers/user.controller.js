import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createTokenAndSaveCookie } from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });
    await newUser.save();
      res.status(201).json({ message: "User registered successfully"});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    createTokenAndSaveCookie(user._id, res);
    res.status(200).json({ message: "User logged in successfully", user:{
        fullname: user.fullname,
        email: user.email,
        id: user._id,
    } });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logged out successfully" });       
    } catch (error) {
        console.log(error); // Debug ke liye
        return res.status(500).json({ error: "Internal server error" });
        
    }
}

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUser= req.user._id; 
    const filteredUsers = await User.find({_id: {$ne: loggedInUser}}, "-password"); // Exclude password field
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}