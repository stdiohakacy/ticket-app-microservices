import mongoose from "mongoose"
import request from 'supertest';
import { app } from '../../app'
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from '../../models/order'

it("returns an error if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signIn())
        .send({ ticketId })
        .expect(404);
})

it("returns an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({ title: "Concert", price: 20 });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "USER-01",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signIn())
        .send({ ticketId: ticket.id })
        .expect(400);
})

it("reserves a ticket", async () => {})