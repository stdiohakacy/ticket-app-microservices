import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new User
interface IUserAttrs {
    email: string;
    password: string;
}
// An interface that describes the properties
// that User Model has
interface IUserModel extends mongoose.Model<any> {
    build(attrs: IUserAttrs): any
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

userSchema.statics.build = (attrs: IUserAttrs) => new User(attrs);

const User = mongoose.model<any, IUserModel>('User', userSchema);

export { User };