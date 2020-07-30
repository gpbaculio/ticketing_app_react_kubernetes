import express, { Request, Response } from 'express'
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@gpbaculiok8stickets/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import Ticket from '../models/ticket'
import Order from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please enter a valid order id')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)

    if (!ticket)
      throw new NotFoundError()

    const isReserved = await ticket.isReserved()
    if (isReserved)
      throw new BadRequestError('Ticket already reserved')

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const newOrder = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await newOrder.save()
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: newOrder.id,
      version: newOrder.version,
      status: newOrder.status,
      userId: newOrder.userId,
      expiresAt: newOrder.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })
    return res.status(201).send(newOrder)
  })

export { router as newOrderRouter }