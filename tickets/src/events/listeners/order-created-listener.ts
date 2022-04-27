import { IOrderCreatedEvent, Listener, Subjects } from "@ticketing-dev-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    async onMessage(data: IOrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error("Ticket not found!");
        }
        ticket.set({ orderId: data.id });
        await ticket.save();
        msg.ack();
    }
}