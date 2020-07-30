import { ExpirationCompletedListener } from "../expiration-complete-listener"
import { natsWrapper } from "../../../nats-wrapper"
import Ticket from "../../../models/ticket"
import mongoose from "mongoose"
import Order, { OrderStatus } from "../../../models/order"
import { ExpirationCompleteEvent } from "@gpbaculiok8stickets/common"
import { Message } from "node-nats-streaming"

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client)
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()
  const order = Order.build({
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: new Date(),
    ticket
  })
  await order.save()
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {
    listener,
    ticket,
    order,
    msg,
    data
  }
}

it('updates the order status to cancelled', async () => {
  const {
    listener,
    ticket,
    order,
    msg,
    data
  } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit order cancelled event', async () => {
  const {
    listener,
    ticket,
    order,
    msg,
    data
  } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)
})

it('acks message', async () => {
  const {
    listener,
    ticket,
    order,
    msg,
    data
  } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})