import { ProductEntity } from '../../products/entities/product.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../../../common/utils';

@Index(['productId', 'period'], { unique: true })
@Entity({ name: 'prices' })
export class PriceEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', nullable: false, comment: 'Дата, с которой начинает действовать цена' })
  period: Date;

  @Column({ comment: 'ИД Продукта' })
  productId: string;

  @ManyToOne(() => ProductEntity, (product) => product.prices)
  product: ProductEntity;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    comment: 'Цена продукта',
    transformer: new ColumnNumericTransformer(),
  })
  price: number;
}
