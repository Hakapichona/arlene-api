import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoutesColumns1775873632715 implements MigrationInterface {
  name = 'RoutesColumns1775873632715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paths\` ADD \`route\` longtext NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`route\` longtext NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`route\``,
    );
    await queryRunner.query(`ALTER TABLE \`paths\` DROP COLUMN \`route\``);
  }
}
