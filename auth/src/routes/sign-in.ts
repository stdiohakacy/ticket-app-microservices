import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';
const router = express.Router();

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
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user)
            throw new BadRequestError('Invalid credentials');
        const passwordMatched = await Password.compare(user.password, password);
        if(!passwordMatched)
            throw new BadRequestError("Invalid Credentials");
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)

        req.session = { jwt: userJwt }

        return res.status(200).send(user);
    }
);

export { router as signInRouter };
