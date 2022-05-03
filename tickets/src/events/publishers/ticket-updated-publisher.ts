import { Publisher, Subjects, ITicketUpdatedEvent } from '@ticketing-dev-org/common';

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
