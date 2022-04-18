import mongoose from 'mongoose';
import { OrderStatus } from '@ticketing-dev-org/common'
import { ITicketDoc } from './ticket';

export { OrderStatus };

interface IOrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: ITicketDoc;
}

interface IOrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: ITicketDoc;
}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
    build(attrs: IOrderAttrs): IOrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

orderSchema.statics.build = (attrs: IOrderAttrs) => new Order(attrs)

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order };
