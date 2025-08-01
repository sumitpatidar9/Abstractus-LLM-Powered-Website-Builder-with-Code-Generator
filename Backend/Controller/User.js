import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../Model/User.js';


import dotenv from 'dotenv';
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;
const cookie_name = process.env.COOKIE_NAME;



const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,       // true in production with HTTPS
  sameSite: 'none',          // optional but safe
  maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days
};



export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: newUser._id }, jwt_secret);
    res.cookie(cookie_name, token, COOKIE_OPTIONS);

    res.status(201).json({ message: 'User created', user: newUser });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, jwt_secret);
    res.cookie(cookie_name, token, COOKIE_OPTIONS);
    res.status(200).json({ message: 'Login successful', user });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const logout = (req, res) => {
  res.clearCookie(cookie_name, COOKIE_OPTIONS);  // token must match the cookie name you set
  res.status(200).json({ message: 'Logout successful' });
};
