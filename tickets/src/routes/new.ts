import express, { Request, Response } from 'express';
import { currentUser, requireAuth, validateRequest } from '@ticketing-dev-org/common';
const router = express.Router();
import { body } from 'express-validator'

router.post(
    "/api/tickets", 
    currentUser, 
    requireAuth, 
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    ],
    validateRequest,
    (req: Request, res: Response) => {
        res.sendStatus(200);
    }
)

export { router as createTicketRouter }