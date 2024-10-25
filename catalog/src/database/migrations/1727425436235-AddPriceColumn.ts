import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceColumn1727425436235 implements MigrationInterface {
  name = 'AddPriceColumn1727425436235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prices" ADD "price" numeric(15,2) NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "prices"."price" IS 'Цена продукта'`);
    await queryRunner.query(`ALTER TABLE "prices" DROP CONSTRAINT "FK_144765f6b6bef86e113b507ed12"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_81905a51bc853387e4ab7cfecd"`);
    await queryRunner.query(`COMMENT ON COLUMN "prices"."product_id" IS 'ИД Продукта'`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_81905a51bc853387e4ab7cfecd" ON "prices" ("product_id", "period") `,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_144765f6b6bef86e113b507ed12" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prices" DROP CONSTRAINT "FK_144765f6b6bef86e113b507ed12"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_81905a51bc853387e4ab7cfecd"`);
    await queryRunner.query(`COMMENT ON COLUMN "prices"."product_id" IS NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_81905a51bc853387e4ab7cfecd" ON "prices" ("period", "product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_144765f6b6bef86e113b507ed12" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "prices"."price" IS 'Цена продукта'`);
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "price"`);
  }
}
