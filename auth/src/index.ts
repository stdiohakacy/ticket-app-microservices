import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signUpRouter } from './routes/sign-up';
import { signOutRouter } from './routes/sign-out';
import { errorHandler} from './middlewares/error-handler'
import 'express-async-errors';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}));
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(errorHandler);

const start = async () => {
    if(!process.env.JWT_KEY)
        throw new Error("JWT KEY must be defined!");
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    } catch (error) {
        console.log(error);        
    }
    app.listen(3000, () => {
        console.log(`Listening on port 3000!`);
    })
}

start();