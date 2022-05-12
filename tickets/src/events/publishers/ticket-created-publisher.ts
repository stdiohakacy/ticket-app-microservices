import { Publisher, Subjects, ITicketCreatedEvent } from '@ticketing-dev-org/common';

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
