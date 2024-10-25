import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderAndOrderItemTable1728025527543 implements MigrationInterface {
  name = 'AddOrderAndOrderItemTable1728025527543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('Created', 'Processing', 'Collected', 'Error', 'Done', 'Canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."order_status_enum", "date" TIMESTAMP WITH TIME ZONE NOT NULL, "total_sum" numeric(15,2) NOT NULL, "customer_id" character varying NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")); COMMENT ON COLUMN "orders"."status" IS 'Статус заказа'; COMMENT ON COLUMN "orders"."date" IS 'Дата формирования заказа'; COMMENT ON COLUMN "orders"."total_sum" IS 'Сумма заказа'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "orders" IS 'Заказы клиентов'`);
    await queryRunner.query(
      `CREATE TABLE "order_items" ("order_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" numeric(10,2) NOT NULL, "unit_price" numeric(15,2) NOT NULL, "sum" numeric(15,2) NOT NULL, CONSTRAINT "PK_6335813ef19bc35b8d866cc6565" PRIMARY KEY ("order_id", "product_id")); COMMENT ON COLUMN "order_items"."order_id" IS 'Id заказа'; COMMENT ON COLUMN "order_items"."product_id" IS 'Id товара'; COMMENT ON COLUMN "order_items"."quantity" IS 'Количество товара'; COMMENT ON COLUMN "order_items"."unit_price" IS 'Цена за единицу товара'; COMMENT ON COLUMN "order_items"."sum" IS 'Сумма за товар'`,
    );
    await queryRunner.query(`ALTER TABLE "product_baskets" DROP COLUMN "quantity"`);
    await queryRunner.query(`ALTER TABLE "product_baskets" ADD "quantity" numeric(15,2) NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "product_baskets"."quantity" IS 'Количество товара в корзине'`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
    await queryRunner.query(`COMMENT ON COLUMN "product_baskets"."quantity" IS 'Количество товара в корзине'`);
    await queryRunner.query(`ALTER TABLE "product_baskets" DROP COLUMN "quantity"`);
    await queryRunner.query(`ALTER TABLE "product_baskets" ADD "quantity" integer NOT NULL`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`COMMENT ON TABLE "orders" IS NULL`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
  }
}
