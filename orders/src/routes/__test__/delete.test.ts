import { Ticket } from "../../models/ticket"
import request from 'supertest';
import { app } from '../../app'
import { Order } from "../../models/order";
import { OrderStatus } from '@ticketing-dev-org/common'

it("Marks on order as cancelled", async () => {
    // create a ticket with Ticket Model
    const ticket = Ticket.build({ title: "Concert", price: 20 })
    await ticket.save();
    const user = global.signIn();

    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // make a request to cancel the order

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204);
    
    // expectation to make sure the thing is cancelled
    const updateOrder = await Order.findById(order.id);
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
})