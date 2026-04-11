import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedByInPath1775947850254 implements MigrationInterface {
  name = 'CreatedByInPath1775947850254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paths\` ADD \`user_uuid\` uuid NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paths\` ADD CONSTRAINT \`FK_21175d019d1fc3d84c3231189ab\` FOREIGN KEY (\`user_uuid\`) REFERENCES \`users\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paths\` DROP FOREIGN KEY \`FK_21175d019d1fc3d84c3231189ab\``,
    );
    await queryRunner.query(`ALTER TABLE \`paths\` DROP COLUMN \`user_uuid\``);
  }
}
