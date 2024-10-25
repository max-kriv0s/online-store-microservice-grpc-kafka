import { ColumnNumericTransformer } from '../../../common/utils';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryColumn({ type: 'uuid', comment: 'Id заказа' })
  orderId: string;

  @PrimaryColumn({ type: 'uuid', comment: 'Id товара' })
  productId: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    comment: 'Количество товара',
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    comment: 'Цена за единицу товара',
    transformer: new ColumnNumericTransformer(),
  })
  unitPrice: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    comment: 'Сумма за товар',
    transformer: new ColumnNumericTransformer(),
  })
  sum: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  order: OrderEntity;
}
