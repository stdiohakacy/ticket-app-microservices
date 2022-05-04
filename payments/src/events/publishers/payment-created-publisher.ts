import { IPaymentCreatedEvent, Publisher, Subjects } from "@ticketing-dev-org/common";

export class PaymentCreatedPublisher extends Publisher<IPaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}