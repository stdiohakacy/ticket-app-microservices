import { currentUser, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@ticketing-dev-org/common';
import express, { Request, Response} from 'express';
import { Order } from '../models/order';
const router = express.Router();

router.delete("/api/orders/:id", currentUser, requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
})

export { router as deleteOrderRouter }