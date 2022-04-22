import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface ITicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface ITicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
    build(attrs: ITicketAttrs): ITicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
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

ticketSchema.statics.build = (attrs: ITicketAttrs) => {
    const { id, title, price } = attrs;
    new Ticket({ _id: id, title, price });
}

ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
        $in: [ OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Completed ],
        },
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { Ticket };
