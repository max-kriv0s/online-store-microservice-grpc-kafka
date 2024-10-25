import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1725267650750 implements MigrationInterface {
  name = 'AddUserTable1725267650750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."roles" AS ENUM('ADMIN', 'MODERATOR', 'BUYER', 'SELLER')`);
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(150) NOT NULL, "email" character varying(150) NOT NULL, "hash_password" character varying NOT NULL, "role" "public"."roles" NOT NULL, "refresh_token" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."roles"`);
  }
}
