import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
