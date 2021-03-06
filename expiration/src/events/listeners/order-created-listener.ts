import { IOrderCreatedEvent, Listener, Subjects } from "@ticketing-dev-org/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:', delay);

        await expirationQueue.add(
            { orderId: data.id},
            { delay }
        );

        msg.ack();
    }
}