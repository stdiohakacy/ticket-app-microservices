import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import 'express-async-errors';
import { errorHandler, NotFoundError, currentUser } from '@ticketing-dev-org/common';
import { createTicketRouter } from './routes/new'

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }));
app.use(createTicketRouter);
app.use(errorHandler);
app.use(currentUser)
export { app };