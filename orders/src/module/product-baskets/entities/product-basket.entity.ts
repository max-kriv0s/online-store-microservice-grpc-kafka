import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/utils';

@Index(['userId', 'productId'], { unique: true })
@Entity({ name: 'product_baskets' })
export class ProductBasketEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'Id владельца корзины товаров' })
  userId: string;

  @Column({ comment: 'Id товара' })
  productId: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    comment: 'Количество товара в корзине',
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number;
}
