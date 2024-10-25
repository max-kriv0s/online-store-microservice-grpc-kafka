import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { USER_VALIDATION } from '../user.constants';
import { Role, ROLE_DB_ENUM_NAME } from '../enums/role.enum';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: USER_VALIDATION.username.length, unique: true })
  username: string;

  @Column({ length: USER_VALIDATION.email.length, unique: true })
  email: string;

  @Column()
  hashPassword: string;

  @Column({ type: 'enum', enum: Role, enumName: ROLE_DB_ENUM_NAME })
  role: Role;

  @Column({ nullable: true })
  refreshToken: string;
}
