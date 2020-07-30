import { Publisher, Subjects, TicketUpdatedEvent } from '@gpbaculiok8stickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}