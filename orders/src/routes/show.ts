import express, { Request, Response } from 'express'
import { requireAuth, NotFoundError, NotAuthorizedError } from '@gpbaculiok8stickets/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import Order from '../models/order'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Please enter a valid order id')
  ],
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')
    if (!order)
      throw new NotFoundError()
    if (order.userId !== req.currentUser!.id)
      throw new NotAuthorizedError()
    return res.send(order)
  })

export { router as showOrderRouter }