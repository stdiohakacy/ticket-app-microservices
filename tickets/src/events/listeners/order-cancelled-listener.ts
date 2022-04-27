import { IOrderCancelledEvent, Listener, Subjects } from "@ticketing-dev-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;
    
    async onMessage(data: IOrderCancelledEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error("Ticket not found!");
        }
        ticket.set({ orderId: undefined });
        await ticket.save();
        const { id, version, title, price, userId, orderId } = ticket;
        await new TicketUpdatedPublisher(this.client).publish({ id, version, title, price, userId, orderId });

        msg.ack();
    }
}