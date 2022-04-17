import { ITicketUpdatedEvent, Publisher, Subjects} from '@ticketing-dev-org/common'

export class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}