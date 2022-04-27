import { Message } from 'node-nats-streaming';
import { IOrderCreatedEvent, OrderStatus } from "@ticketing-dev-org/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = await Ticket.build({
        title: "Concert",
        price: 200,
        userId: "USER-01"
    })

    await ticket.save();

    const { id, price } = ticket;

    const data: IOrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "USER-01",
        expiresAt: "",
        ticket: { id, price }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }; 
}

it("set the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    console.log(updatedTicket)
    expect(updatedTicket!.orderId).toEqual(data.id);
})

it("ack a message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})