import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import 'express-async-errors';
import { errorHandler } from '@ticketing-dev-org/common';
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }));

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
app.use(errorHandler);

export { app };