import { OrderCancelledListener } from "../order-canceled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import Ticket from "../../../models/ticket"
import mongoose from "mongoose"
import { OrderCancelledEvent } from "@gpbaculiok8stickets/common"
import { Message } from "node-nats-streaming"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })
  ticket.set({ orderId })
  await ticket.save()
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
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
    msg,
    orderId
  }
}

it('update ticket/publish event/acks message', async () => {
  const {
    ticket,
    listener,
    data,
    msg
  } = await setup()

  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})