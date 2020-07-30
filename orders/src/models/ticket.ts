import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

import Order, { OrderStatus } from './order';

interface TicketProps {
  title: string
  price: number
  id: string
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  isReserved(): Promise<boolean>
  version: number
}
interface EventArgPropsType {
  id: string,
  version: number
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(props: TicketProps): TicketDoc
  findByEvent(event: EventArgPropsType): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id
    }
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = (event: EventArgPropsType) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 })
}

ticketSchema.statics.build = (props: TicketProps) => new Ticket({ _id: props.id, ...props })
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })
  if (existingOrder)
    return true
  else
    return false
}
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket