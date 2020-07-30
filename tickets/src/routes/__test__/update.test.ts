import request from 'supertest'
import mongoose from 'mongoose'

import app from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import Ticket from '../../models/ticket'

it(
  'returns 404 if the user provided id that does not exist',
  async () => {
    const mockId = new mongoose
      .Types
      .ObjectId()
      .toHexString()
    await request(app)
      .put(`/api/tickets/${mockId}`)
      .set('Cookie', global.signin())
      .send({ title: 'my title', price: 20 })
      .expect(404)
  }
)

it(
  'returns 401 if user is not authenticated',
  async () => {
    const mockId = new mongoose
      .Types
      .ObjectId()
      .toHexString()
    await request(app)
      .put(`/api/tickets/${mockId}`)
      .send({ title: 'my title', price: 20 })
      .expect(401)
  }
)

it(
  'returns 401 if user does not own the ticket',
  async () => {
    const createTicketResponse = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', global.signin())
      .send({ title: 'my title', price: 20 })

    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', global.signin())
      .send({ title: 'my new title', price: 21 })
      .expect(401)
  }
)

it(
  'returns 400 if the user provides an invalid title or price',
  async () => {
    const cookie = global.signin()
    const createTicketResponse = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({ title: 'my title', price: 20 })
    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 20 })
      .expect(400)
    await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'my new title', price: -10 })
      .expect(400)
  }
)

it(
  'updates ticket provided valid inputs',
  async () => {
    const cookie = global.signin()
    const createTicketResponse = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({ title: 'my title', price: 20 })
    const updateTicketResponse = await request(app)
      .put(`/api/tickets/${createTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'my new title', price: 120 })
      .expect(200)
    const updatedTicketResponse = await request(app)
      .get(`/api/tickets/${updateTicketResponse.body.id}`)
      .set('Cookie', cookie)
      .send()
    expect(updatedTicketResponse.body.title).toEqual('my new title')
    expect(updatedTicketResponse.body.price).toEqual(120)
  }
)
it('publishes update ticket event', async () => {
  const cookie = global.signin()
  const createTicketResponse = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'my title', price: 20 })
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'my new title', price: 120 })
    .expect(200)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
it('rejects update if ticket is reserved', async () => {
  const cookie = global.signin()
  const createTicketResponse = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'my title', price: 20 })
  const ticket = await Ticket.findById(createTicketResponse.body.id)
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()
  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'my new title', price: 120 })
    .expect(400)
})