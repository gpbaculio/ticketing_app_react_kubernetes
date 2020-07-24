import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket'
import mongoose from 'mongoose'

it('returns 404 if ticket is not found', async () => {
  const mockId = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .get(`/api/tickets/${mockId}`)
    .send()
    .expect(404)
})

it('returns ticket found', async () => {
  const title = 'concert'
  const price = 20
  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    }).expect(201)

  const getTicketResponse = await request(app)
    .get(`/api/tickets/${createTicketResponse.body.id}`)
    .send()
    .expect(200)

  expect(getTicketResponse.body.title).toEqual(title)
  expect(getTicketResponse.body.price).toEqual(price)
})