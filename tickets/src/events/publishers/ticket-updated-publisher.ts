import { Publisher, Subjects, ITicketUpdatedEvent } from '@ticketing-dev-org/common';

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
