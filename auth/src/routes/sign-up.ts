import express, { Request, Response } from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

router.post('/api/users/sign-up', [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 })
            .withMessage("Password must be at least 4 and 20 characters")], 
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            throw new RequestValidationError(errors.array());
        // const { email, password } = req.body;
        console.log(`Creating a user...`);
        throw new DatabaseConnectionError();
        // return res.json({ message: "Sign up" })
});

export {router as signUpRouter}