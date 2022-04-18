import { requireAuth, validateRequest } from '@ticketing-dev-org/common';
import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
const router = express.Router();

router.post(
    "/api/orders", 
    requireAuth, 
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("Ticket id must be provided!")
    ], 
    validateRequest,
    (req: Request, res: Response) => {
    return res.send({})
})

export { router as newOrderRouter }