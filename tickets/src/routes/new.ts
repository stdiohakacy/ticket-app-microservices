import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, currentUser } from '@ticketing-dev-org/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/tickets',
    currentUser,
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
        await ticket.save();

        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: "123",
            version: 123,
            title: "asdfkj",
            price: 123,
            userId: "123lkj12",
        });

        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
