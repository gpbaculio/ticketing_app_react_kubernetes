import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/ticket'

interface createTicketPropsType {
  title: string,
  price: number
}

const createTicket = ({ title, price }: createTicketPropsType) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201)
}

it('creates ticket with valid inputs', async () => {
  await createTicket({ title: 'my 1st ticket', price: 10 })
  await createTicket({ title: 'my 2nd ticket', price: 10 })
  await createTicket({ title: 'my 3rd ticket', price: 10 })
  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)
  expect(response.body.length).toEqual(3)
})