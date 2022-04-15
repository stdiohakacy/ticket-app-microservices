import { Publisher } from "@ticketing-dev-org/common";
import { ITicketCreatedEvent, Subjects } from '@ticketing-dev-org/common'
export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}