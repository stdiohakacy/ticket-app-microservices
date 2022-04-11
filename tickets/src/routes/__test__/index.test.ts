import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
    return await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signIn())
        .send({ title: "Ticket title 01", price: 100 })
}

it("fetch list of tickets", async () => {
    await Promise.all([null, null, null].map(() => createTicket()))

    const response = await request(app)
        .get("/api/tickets")
        .send({})
        .expect(200)
    expect(response.body.length).toEqual(3);
})