import {
    IPaymentCreatedEvent, Listener,
    NotFoundError,
    OrderStatus,
    Subjects
} from '@ticketing-dev-org/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<IPaymentCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

    async onMessage(data: IPaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if(!order) {
            throw new NotFoundError();
        }

        order.set({ status: OrderStatus.Completed });
        await order.save();

        msg.ack();
    }
}
