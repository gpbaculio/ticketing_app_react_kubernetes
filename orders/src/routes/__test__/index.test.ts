import request from 'supertest'
import mongoose from 'mongoose'

import app from "../../app"
import Ticket from '../../models/ticket'
import Order, { OrderStatus } from '../../models/order'
const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title,
    price
  })
  await ticket.save()
  return ticket
}
it("fetches orders for particular user", async () => {
  const ticketOne = await buildTicket('ticket one', 10)
  const ticketTwo = await buildTicket('ticket two', 20)
  const ticketThre = await buildTicket('ticket three', 30)

  const userOne = global.signin()
  const userTwo = global.signin()

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThre.id })

  const responseOne = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200)

  const responseTwo = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  expect(responseOne.body.length).toEqual(1)
  expect(responseTwo.body.length).toEqual(2)
})