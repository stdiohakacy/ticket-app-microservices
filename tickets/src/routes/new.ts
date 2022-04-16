import express, { Request, Response } from 'express';
import { currentUser, requireAuth, validateRequest } from '@ticketing-dev-org/common';
const router = express.Router();
import { body } from 'express-validator'
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nat-wrappers';

router.post(
    "/api/tickets", 
    currentUser, 
    requireAuth, 
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body
        const ticketBuilded = Ticket.build({ title, price, userId: req.currentUser!.id });
        const ticket = await ticketBuilded.save();

        if(ticket) {
            const { id, title, price, userId } = ticket
            new TicketCreatedPublisher(natsWrapper.client).publish({ id, title, price, userId });
        }

        res.status(201).send(ticket);
    }
)

export { router as createTicketRouter }