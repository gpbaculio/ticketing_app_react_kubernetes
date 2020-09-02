import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it(
  'has a handler listening to /api/tickets for post requests',
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({})
    expect(response.status).not.toEqual(404)
  }
)

it(
  'can only be accessed if user is signed in',
  async () => {
    await request(app).post('/api/tickets').send({}).expect(401)
  }
)

it(
  'returns a status code other than 401 if user is signed in',
  async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({})
    expect(response.status).not.toEqual(401)
  }
)

it(
  'returns error if invalid title is provided',
  async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: '',
        price: 10
      })
      .expect(400)
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        price: 10
      })
      .expect(400)
  }
)

it(
  'returns error if invalid price is provided',
  async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'new ticket',
        price: -10
      })
      .expect(400)
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'new ticket',
      })
      .expect(400)
  }
)

it(
  'creates ticket with valid inputs',
  async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'new ticket',
        price: 10
      })
      .expect(201)
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
  }
)

it(
  'publishes an avent',
  async () => {
    const title = 'new ticket'

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price: 10
      })
    expect(natsWrapper.client.publish).toHaveBeenCalled()
  }
)