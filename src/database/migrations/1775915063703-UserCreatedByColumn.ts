import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCreatedByColumn1775915063703 implements MigrationInterface {
  name = 'UserCreatedByColumn1775915063703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`created_by\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`created_by\``);
  }
}
