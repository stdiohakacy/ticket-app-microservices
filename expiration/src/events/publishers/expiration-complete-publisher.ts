import { IExpirationCompleteEvent, Publisher, Subjects } from "@ticketing-dev-org/common";

export class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}