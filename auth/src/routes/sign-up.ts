import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
const router = express.Router();

router.post('/api/users/sign-up', 
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be at least 4 and 20 characters")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            throw new BadRequestError('Email in use');
        }
        const user = User.build({ email, password });
        await user.save();
        // Generate jwt
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)
        // Store it on session object
        req.session = { jwt: userJwt }
        return res.status(201).send(user);
});

export { router as signUpRouter };
