import {
    currentUser,
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest
} from '@ticketing-dev-org/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator'

const router = express.Router();

router.put(
    '/api/tickets/:id',
    currentUser,
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const id = req.params.id;
        const ticket = await Ticket.findById(id);

        if (!ticket) throw new NotFoundError();
        if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

        ticket.set({ title, price })
        await ticket.save();

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
