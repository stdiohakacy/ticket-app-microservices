import { Publisher, IOrderCreatedEvent, Subjects } from '@ticketing-dev-org/common';

export class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
