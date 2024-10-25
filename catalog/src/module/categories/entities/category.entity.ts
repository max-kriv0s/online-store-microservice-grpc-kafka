import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { CATEGORY_VALIDATION } from '../categories.constants';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: CATEGORY_VALIDATION.name.length, unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
