import { Publisher, ExpirationCompleteEvent, Subjects } from '@gpbaculiok8stickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}