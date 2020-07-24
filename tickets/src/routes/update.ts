import express, { Request, Response } from 'express'
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError
} from '@gpbaculiok8stickets/common'
import { body } from 'express-validator'

import Ticket from '../models/ticket'

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
    else if (ticket.userId !== req.currentUser!.id)
      throw new NotAuthorizedError()
    else {
      const { title, price } = req.body
      ticket.set({ title, price })
      await ticket.save()
      return res.send(ticket)
    }
  })

export { router as updateTicketRouter }