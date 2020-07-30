import mongoose from 'mongoose'
import { TicketUpdatedEvent } from '@gpbaculiok8stickets/common'
import { Message } from 'node-nats-streaming'

import Ticket from "../../../models/ticket"

import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 44,
    userId: '123'
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return {
    listener,
    data,
    msg,
    ticket
  }
}
it('find/update/save a ticket', async () => {
  const {
    listener,
    data,
    msg,
    ticket
  } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(data.id)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})
it('acks the message', async () => {
  const {
    listener,
    data,
    msg
  } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
it('does not call ack if event has skipped version num', async () => {
  const {
    listener,
    data,
    msg,
    ticket
  } = await setup()
  data.version = 12
  try {
    await listener.onMessage(data, msg)
  } catch (error) { }
  expect(msg.ack).not.toHaveBeenCalled()
})