import express, {Request, Response} from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';

router.post('/api/users/sign-in', 
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid!"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password")
    ],
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            throw new RequestValidationError(errors.array());
    }
);

export {router as signInRouter}