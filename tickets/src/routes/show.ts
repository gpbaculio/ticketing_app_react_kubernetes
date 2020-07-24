import express, { Request, Response } from 'express'
import { NotFoundError } from '@gpbaculiok8stickets/common'
import Ticket from '../models/ticket'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket)
    throw new NotFoundError()
  else
    return res.send(ticket)
})

export { router as showTicketsRouter }