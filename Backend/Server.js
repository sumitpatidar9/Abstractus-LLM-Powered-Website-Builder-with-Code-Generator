import express from 'express';
import {router} from './Routes/ChatRoute.js';
import {userRouter} from './Routes/UserRoute.js';
import { connectDB } from './Utils/Connection.js'
import { Session } from './Model/Session.js';
import mongoose from 'mongoose';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import env from 'dotenv';



env.config();
const cookiesecret = process.env.COOKIE_SECRET;
const port = process.env.PORT || 5000;


const app = express();
app.use(express.json());


app.use(cors({
  origin: true, 
  credentials: true
}));


app.use(cookieParser(cookiesecret));
connectDB();

app.use('/home', router);
app.use('/user', userRouter);


app.listen(port, ()=>{
    console.log(`Server is runnin on ${port}`);
})
