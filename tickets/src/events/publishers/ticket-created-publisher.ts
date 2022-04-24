import { Publisher, Subjects, ITicketCreatedEvent } from '@ticketing-dev-org/common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
