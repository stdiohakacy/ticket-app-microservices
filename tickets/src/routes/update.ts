import {
    currentUser,
    NotFoundError,
    requireAuth
} from '@ticketing-dev-org/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) throw new NotFoundError();

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
