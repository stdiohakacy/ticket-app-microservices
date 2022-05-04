import { OrderStatus } from '@ticketing-dev-org/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
// import { stripe } from '../../stripe'
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});

jest.mock("../../stripe");
jest.useFakeTimers('legacy')

it("returns a 404 when purchasing an order that does not exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signIn())
        .send({ 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
})

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signIn())
        .send({ 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            orderId: order.id,
        })
        .expect(401);
})

it("returns a 400 then purchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signIn(userId))
        .send({ 
            orderId: order.id, 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" 
        })
        .expect(400)
})

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    // const price = Math.floor(Math.random() * 100000);
    const price = 5000;
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price,
      status: OrderStatus.Created,
    });
    await order.save();
  
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id,
      })
      .expect(201);
  
    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => charge.amount === price * 100);
    console.log(stripeCharge);
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');
  });
  