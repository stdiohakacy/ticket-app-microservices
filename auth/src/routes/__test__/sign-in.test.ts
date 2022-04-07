import request from 'supertest';
import { app } from '../../app';

it("fails when a email that does not exist is supplied", async () => {
    await request(app)
        .post("/api/users/sign-in")
        .send({ email: "user@gmail.com", password: "123123" })
        .expect(400)
})

it("fails when incorrect password is supplied", async () => {
    await request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin@gmail.com", password: "123123" })
        .expect(201)

    await request(app)
        .post("/api/users/sign-in")
        .send({ email: "admin@gmail.com", password: "123456" })
        .expect(400)
})

it("responds with a cookie when given valid credentials", async () => {
    await request(app)
        .post("/api/users/sign-up")
        .send({ email: "admin@gmail.com", password: "123123" })
        .expect(201)

    const response = await request(app)
        .post("/api/users/sign-in")
        .send({ email: "admin@gmail.com", password: "123123" })
        .expect(200)

    expect(response.get("Set-Cookie")).toBeDefined()
})