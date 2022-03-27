import express, { Request, Response } from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

router.post('/api/users/sign-up', [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 })
            .withMessage("Password must be at least 4 and 20 characters")], 
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            throw new RequestValidationError(errors.array());
        const { email, password } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            throw new BadRequestError('Email in use');
        }
        const user = User.build({ email, password });
        await user.save();
        // Generate jwt
        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)
        // Store it on session object
        req.session = { jwt: userJWT }
        return res.status(201).send(user);
});

export {router as signUpRouter}