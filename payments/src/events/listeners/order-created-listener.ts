import { Message } from 'node-nats-streaming';
import { Listener, IOrderCreatedEvent, Subjects } from '@ticketing-dev-org/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreatedEvent['data'], msg: Message) {
    console.log(data);
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    const orderCreated = await order.save();
    console.log(orderCreated);

    msg.ack();
  }
}
