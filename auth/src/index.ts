import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signUpRouter } from './routes/sign-up';
import { signOutRouter } from './routes/sign-out';
import { errorHandler} from './middlewares/error-handler'
import 'express-async-errors';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.use(errorHandler);

app.all("*", async(req, res) => {
    throw new NotFoundError()
})

app.listen(3000, () => {
    console.log(`Listening on port 3000!`);
})