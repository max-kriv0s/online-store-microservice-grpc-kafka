import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { PRODUCT_VALIDATION } from '../products.constants';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { PriceEntity } from '../../prices/entities/price.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: PRODUCT_VALIDATION.name.maxLength, unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, { nullable: false })
  category: CategoryEntity;

  @OneToMany(() => PriceEntity, (price) => price.product)
  prices: PriceEntity[];
}
