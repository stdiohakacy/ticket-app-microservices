import { ITicketCreatedEvent, Publisher, Subjects} from '@ticketing-dev-org/common'

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}