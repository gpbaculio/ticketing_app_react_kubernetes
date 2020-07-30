import { OrderCreatedEvent, OrderStatus } from '@gpbaculiok8stickets/common'

import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import Ticket from "../../../models/ticket";
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  })
  await ticket.save()
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: '456',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {
    ticket,
    listener,
    data,
    msg
  }
}
it('sets userid of the ticket', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})
it('acks message', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
it('publishes ticket updated event', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(data.id).toEqual(ticketUpdatedData.orderId)
})