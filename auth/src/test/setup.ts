import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

let mongo: MongoMemoryServer

declare global {
    var signIn: () => Promise<string[]>;
}

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signIn(): Promise<string[]>;
//         }
//     }
// }

beforeAll(async () => {
    process.env.JWT_KEY= "jwt_secret_key"
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signIn = async () => {
    const email = "test@test.com";
    const password = "password";
    const response = await request(app)
        .post("/api/users/sign-up")
        .send({ email, password })
        .expect(201)

    return response.get("Set-Cookie")
}