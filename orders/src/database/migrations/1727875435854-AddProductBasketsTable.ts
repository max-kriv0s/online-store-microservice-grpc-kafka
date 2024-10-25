import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductBasketsTable1727875435854 implements MigrationInterface {
  name = 'AddProductBasketsTable1727875435854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_baskets" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "product_id" character varying NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_af7393c295aed562ac001a62a52" PRIMARY KEY ("id")); COMMENT ON COLUMN "product_baskets"."user_id" IS 'Id владельца корзины товаров'; COMMENT ON COLUMN "product_baskets"."product_id" IS 'Id товара'; COMMENT ON COLUMN "product_baskets"."quantity" IS 'Количество товара в корзине'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f63d19da6e83142ba9398c3d73" ON "product_baskets" ("user_id", "product_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_f63d19da6e83142ba9398c3d73"`);
    await queryRunner.query(`DROP TABLE "product_baskets"`);
  }
}
