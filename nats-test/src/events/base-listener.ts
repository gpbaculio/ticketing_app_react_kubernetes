import { Stan, Message } from "node-nats-streaming";

export abstract class Listener {
  abstract subject: string
  abstract queueGroupName: string
  abstract onMessage(data: any, msg: Message): void
  protected ackWait = 5 * 1000
  private client: Stan;
  constructor(client: Stan) {
    this.client = client
  }
  subcriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subcriptionOptions()
    )
    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)
      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })
  }
  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string' ?
      JSON.parse(data) : JSON.parse(data.toString('utf-8'))
  }
}

class TicketCreatedListener extends Listener {
  subject = 'ticket:created'
  queueGroupName = 'payments-service'
  onMessage(data: any, msg: Message) {
    console.log('event data:', data)
    msg.ack()
  }
}