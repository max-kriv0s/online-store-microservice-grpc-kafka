import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdminUser1725544849423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO \"user\" (username, email, hash_password, role) VALUES ('admin', 'admin@test.com', '$argon2id$v=19$m=65536,t=3,p=4$1a6sxxuO5r18arOtPbtU2Q$3UFwLLpjM4uiYBPJNWXg+b9h6O8el5oDCTb2v/W1MTQ', 'ADMIN')",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "user" WHERE email=\'admin@test.com\'');
  }
}
