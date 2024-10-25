import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesCategoriesProductsPrices1726233904713 implements MigrationInterface {
  name = 'CreateTablesCategoriesProductsPrices1726233904713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" character varying NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prices" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "period" date NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id")); COMMENT ON COLUMN "prices"."period" IS 'Дата, с которой начинает действовать цена'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_81905a51bc853387e4ab7cfecd" ON "prices" ("product_id", "period") `,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_144765f6b6bef86e113b507ed12" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prices" DROP CONSTRAINT "FK_144765f6b6bef86e113b507ed12"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_81905a51bc853387e4ab7cfecd"`);
    await queryRunner.query(`DROP TABLE "prices"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
