import { Subjects, Publisher, IOrderCancelledEvent } from '@ticketing-dev-org/common';

export class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
