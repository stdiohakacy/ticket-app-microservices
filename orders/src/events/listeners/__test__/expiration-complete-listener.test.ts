import { IExpirationCompleteEvent, OrderStatus } from '@ticketing-dev-org/common';
import mongoose from "mongoose";
import { Message } from 'node-nats-streaming';
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 200
    })

    const order = Order.build({
        status: OrderStatus.Created,
        userId: "USER-01",
        expiresAt: new Date(),
        ticket
    })

    await ticket.save();
    await order.save();

    const data: IExpirationCompleteEvent["data"] = { orderId: order.id }
    // @ts-ignore
    const msg: Message = { ack: jest.fn() }

    return { listener, order, ticket, data, msg }
}

it("emit an OrderCancelled event", async () => {
    const { listener, order, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )

    expect(eventData.id).toEqual(order.id);
})

it("ack the message", async () => {
    const { listener, order, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})