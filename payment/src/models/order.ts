import { OrderStatus } from "@ticketing-dev-org/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IOrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus
}

interface IOrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus
}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
    build(attrs: IOrderAttrs): IOrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrderAttrs) => {
    const {id, price, userId, version, status } = attrs
    return new Order({ _id: attrs.id, version, price, userId, status });
}

const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order }