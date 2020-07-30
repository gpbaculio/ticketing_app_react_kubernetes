import { Publisher, OrderCreatedEvent, Subjects } from "@gpbaculiok8stickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}