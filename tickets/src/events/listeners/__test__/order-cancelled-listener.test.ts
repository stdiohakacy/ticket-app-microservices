import { Message } from 'node-nats-streaming';
import { IOrderCancelledEvent } from "@ticketing-dev-org/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({ title: "Ticket 001", price: 100, userId: "123" });
    ticket.set({ orderId })
    await ticket.save();

    const data: IOrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: { id: ticket.id }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, orderId, msg, ticket }
}

it("updates the ticket, publishes an event, and ack message", async () => {
    const { listener, data, orderId, msg, ticket } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toBeDefined();
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})