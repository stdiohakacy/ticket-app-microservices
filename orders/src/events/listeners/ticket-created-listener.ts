import { ITicketCreatedEvent, Listener, Subjects } from "@ticketing-dev-org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({ id, title, price });
        await ticket.save();

        msg.ack();
    }
}