import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler } from './middlewares/error-handler'
import mongoose from 'mongoose';
import cookieSession from "cookie-session";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(errorHandler);

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT KEY must be defined!');
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("MongoDb connected!");
  } catch (error) {
    console.error(error)
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
}

start();