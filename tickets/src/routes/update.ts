import express, { Request, Response } from 'express'
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError
} from '@gpbaculiok8stickets/common'
import { body } from 'express-validator'

import Ticket from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket)
      throw new NotFoundError()
    else if (ticket.orderId)
      throw new BadRequestError('Cannot edit reserved ticket')
    else if (ticket.userId !== req.currentUser!.id)
      throw new NotAuthorizedError()
    else {
      const { title, price } = req.body
      ticket.set({ title, price })
      await ticket.save()
      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
      })
      return res.send(ticket)
    }
  })

export { router as updateTicketRouter }