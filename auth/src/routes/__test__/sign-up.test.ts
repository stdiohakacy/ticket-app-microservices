import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: "admin@gmail.com",
            password: "123456"
        })
        .expect(201)
})

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "admin@gmail.com",
        })
        .expect(400);

    await request(app)
        .post('/api/users/sign-up')
        .send({
            password: "password",
        })
        .expect(400);
})

it('Sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "admin@gmail.com",
            password: "123456"
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
    
})