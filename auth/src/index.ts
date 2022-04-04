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
app.use(json());
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(errorHandler);
app.set("trust proxy", true);
app.use(cookieSession({
  signed: false,
  secure: true
}))

const start = async () => {
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