import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
    const ticket = Ticket.build({ title: 'Concert', price: 20 });
    await ticket.save();

    return ticket;
};

it('fetches orders for an particular user', async () => {
    const [user1, user2] = Array(2).fill(null).map(() => global.signIn());

    // Create three tickets
    const [ticket1, ticket2, ticket3] = await Promise.all(
        Array(3).fill(null).map(async () => await buildTicket())
    );

    // Create one order as User #1
    await request(app)
      .post('/api/orders')
      .set('Cookie', user1)
      .send({ ticketId: ticket1.id })
      .expect(201);
  
    // Create two orders as User #2
    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticket2.id })
      .expect(201);
    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticket3.id })
      .expect(201);
  
    // Make request to get orders for User #2
    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', user2)
      .expect(200);
  
    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
  });
  