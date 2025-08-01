import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

import dotenv from 'dotenv';
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;
const cookieName = process.env.COOKIE_NAME;

export const verifyUser = async (req, res, next) => {
  try {
    const token = await req.cookies[cookieName];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, jwt_secret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
