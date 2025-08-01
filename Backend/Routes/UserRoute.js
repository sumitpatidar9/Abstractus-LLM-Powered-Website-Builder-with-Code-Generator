

import express from 'express';
import { signup, login, logout } from '../Controller/User.js';
import { verifyUser } from '../Controller/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

userRouter.get('/verify', verifyUser, (req, res) => {
  res.status(200).json({ user: req.user });
});

export {userRouter};
