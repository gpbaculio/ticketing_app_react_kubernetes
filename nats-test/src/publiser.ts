import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

client.on('connect', async () => {
  // console.log('Publisher connected to NATS')
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: '$20'
  // })
  // client.publish('ticket:create', data, () => {
  //   console.log('event published')
  // })
  const publisher = new TicketCreatedPublisher(client)
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    })
  } catch (error) {
    console.log('error: ', error)
  }
})