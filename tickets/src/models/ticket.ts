import mongoose from 'mongoose'

interface TicketPropsType {
  title: string
  price: number
  userId: string
}
interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticketProps: TicketPropsType): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.statics.build = (ticketProps: TicketPropsType) => {
  return new Ticket(ticketProps)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket