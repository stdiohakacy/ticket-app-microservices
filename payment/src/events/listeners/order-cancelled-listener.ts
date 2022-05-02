import { IOrderCancelledEvent, Listener, OrderStatus, Subjects } from "@ticketing-dev-org/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: IOrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        })

        if (!order) {
            throw new Error("Order not found!");
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        msg.ack();
    }
}