import { Message } from "node-nats-streaming";
import { Listener, ITicketCreatedEvent, Subjects } from '@ticketing-dev-org/common'

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
        console.log('Event data!', data);
        msg.ack();
    }
}
