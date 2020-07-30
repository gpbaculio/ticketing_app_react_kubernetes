import request from 'supertest'
import mongoose from 'mongoose'

import app from "../../app"
import Ticket from '../../models/ticket'

it(
  'fetches the order',
  async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20
    })
    await ticket.save()

    const user = global.signin()
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)
    const { body: fetchOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)
    expect(fetchOrder.id).toEqual(order.id)
  }
)

it(
  'returns error if user tries to fetch order of another user',
  async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20
    })
    await ticket.save()
    const user = global.signin()
    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)

    const anotherUser = global.signin()

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', anotherUser)
      .send()
      .expect(401);
  }
)