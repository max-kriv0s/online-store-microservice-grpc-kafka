import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ORDER_STATUS_ENUM_NAME, OrderStatus } from '../enums/order-status.enum';
import { ColumnNumericTransformer } from '../../../common/utils';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'orders', comment: 'Заказы клиентов' })
export class OrderEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: ORDER_STATUS_ENUM_NAME,
    nullable: true,
    comment: 'Статус заказа',
  })
  status: OrderStatus;

  @Column({ type: 'timestamptz', nullable: false, comment: 'Дата формирования заказа' })
  date: Date;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    comment: 'Сумма заказа',
    transformer: new ColumnNumericTransformer(),
  })
  totalSum: number;

  @Column()
  customerId: string;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItemEntity[];

  cancel() {
    this.status = OrderStatus.Canceled;
  }

  confirm() {
    this.status = OrderStatus.Confirmed;
  }
}
