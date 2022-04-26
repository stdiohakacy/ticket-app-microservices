import { ITicketCreatedEvent } from "@ticketing-dev-org/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
    // create instance of listener
    const listener: TicketCreatedListener = new TicketCreatedListener(natsWrapper.client);

    // create fake data event
    const data: ITicketCreatedEvent["data"] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 0,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it("create and save a ticket", async () => {
    const { listener, data, msg } = await setup();
    // call the onMessage func with data + message object
    await listener.onMessage(data, msg);
    // write a assertion to make sure a ticket created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
})


it("ack a message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})