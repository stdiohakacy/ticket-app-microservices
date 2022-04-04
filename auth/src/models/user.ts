import mongoose from 'mongoose';
import { Password } from '../services/Password';

// An interface that describes the properties
// that are required to create a new User
interface IUserAttrs {
    email: string;
    password: string;
}
// An interface that describes the properties
// that User Model has
interface IUserModel extends mongoose.Model<IUserDoc> {
    build(attrs: IUserAttrs): IUserDoc
}
// An interface that describes the properties
// that User Document has
interface IUserDoc extends mongoose.Document {
    email: string;
    password: string;    
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
})

userSchema.statics.build = (attrs: IUserAttrs) => new User(attrs);

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User };