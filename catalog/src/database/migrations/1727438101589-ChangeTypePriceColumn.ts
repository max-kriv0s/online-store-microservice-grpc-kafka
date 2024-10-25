import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypePriceColumn1727438101589 implements MigrationInterface {
  name = 'ChangeTypePriceColumn1727438101589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_81905a51bc853387e4ab7cfecd"`);
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "period"`);
    await queryRunner.query(`ALTER TABLE "prices" ADD "period" TIMESTAMP WITH TIME ZONE NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "prices"."period" IS 'Дата, с которой начинает действовать цена'`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_81905a51bc853387e4ab7cfecd" ON "prices" ("product_id", "period") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_81905a51bc853387e4ab7cfecd"`);
    await queryRunner.query(`COMMENT ON COLUMN "prices"."period" IS 'Дата, с которой начинает действовать цена'`);
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "period"`);
    await queryRunner.query(`ALTER TABLE "prices" ADD "period" date NOT NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_81905a51bc853387e4ab7cfecd" ON "prices" ("period", "product_id") `,
    );
  }
}
