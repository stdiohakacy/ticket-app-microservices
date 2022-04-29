import { IExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@ticketing-dev-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
    queueGroupName: string = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: IExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate("ticket");
        if (!order) {
            throw new Error("Order not found");
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: { id: order.ticket.id }
        });

        msg.ack();
    }
}