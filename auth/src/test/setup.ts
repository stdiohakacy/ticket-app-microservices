import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app'

let mongod: any

// declare global {
//     namespace NodeJS {
//         interface Global {
//             signIn(): Promise<string[]>
//         }
//     }
// }

declare global {
    var signIn: () => Promise<string[]>;
}
beforeAll(async () => {
    process.env.JWT_KEY = "secret_key"
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongod.stop();
    await mongoose.connection.close();
});

global.signIn = async () => {
    const email = "admin@gmail.com";
    const password = "123123"

    const authResponse = await request(app)
        .post("/api/users/sign-up")
        .send({ email, password })
        .expect(201)

    return authResponse.get("Set-Cookie");
}