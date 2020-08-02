import mongoose from 'mongoose'
import request from 'supertest'
import { OrderStatus } from '@gpbaculiok8stickets/common'

import app from '../../app'
import Order from '../../models/order'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('returns order when purchasing order  that ioes not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'abcd123',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})
it('returns 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: OrderStatus.Created
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(10 * 100)
  expect(chargeOptions.currency).toEqual('usd')
})