import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, RequestValidationError, validateRequest } from '@ticketing-dev-org/common';
import { User } from '../models/user';
import { Password } from '../services/Password';
const router = express.Router();

router.post('/api/users/sign-in', 
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid!"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You should provide password!")
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            throw new RequestValidationError(errors.array());

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user)
            throw new BadRequestError("Invalid credentials!");
        const passwordMatch = await Password.compare(user.password, password);
        if (!passwordMatch) {
            throw new BadRequestError("Invalid credentials!");
        }
        
        const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
        req.session = { jwt: userJwt }

        return res.status(200).send(user);
})

export { router as signInRouter };
