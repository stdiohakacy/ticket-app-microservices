import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock("../nats-wrapper");

let mongod: any
declare global {
    var signIn: () => [string];
}

beforeAll(async () => {
    process.env.JWT_KEY = "JWT_SECRET"
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

global.signIn = () => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
      };
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}