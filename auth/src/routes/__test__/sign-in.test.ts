import request from 'supertest';
import { app } from '../../app';

it('Fails when a email that does not exit is supplied', async () => {
    await request(app)
        .post('/api/users/sign-in')
        .send({
            email: "admin@gmail.com",
            password: "123456"
        })
        .expect(400);
})

it('Fails when an incorrect password is supplied',  async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/sign-in')
        .send({
            email: "test@test.com",
            password: "123123"
        })
        .expect(400);
})

it('Responses with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({ email: "test@test.com", password: "password" })
        .expect(201)

    const response = await request(app)
        .post('/api/users/sign-in')
        .send({ email: "test@test.com", password: "password" })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();
})