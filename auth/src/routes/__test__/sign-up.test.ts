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