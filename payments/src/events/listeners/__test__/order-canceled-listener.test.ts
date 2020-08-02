import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus, OrderCancelledEvent } from "@gpbaculiok8stickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import Order from "../../../models/order"
import { OrderCancelledListener } from "../order-canceled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0
  })
  await order.save()
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {
    data,
    msg,
    order,
    listener
  }
}

it('updates status of order', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('acks message', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
