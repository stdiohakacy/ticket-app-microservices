import request from 'supertest';
import { app } from '../../app';

it("return a 201 on successful sign up", async () => {
    return request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin@gmail.com", password: "123123" })
        .expect(201);
})

it("returns a 400 with an invalid email", async () => {
    return request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin", password: "123123" })
        .expect(400);
})


it("returns a 400 with missing email or password", async () => {
    await request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin" })
        .expect(400);

    await request(app)
        .post("/api/users/sign-up")
        .send({ password: "123123" })
        .expect(400);
})


it("disallows duplicate email", async () => {
    await request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin@gmail.com", password: "123123" })
        .expect(201);

        await request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin@gmail.com", password: "123123" })
        .expect(400);
})
