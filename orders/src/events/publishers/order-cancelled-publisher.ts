import { Publisher, OrderCancelledEvent, Subjects } from "@gpbaculiok8stickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}