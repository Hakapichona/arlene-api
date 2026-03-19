import { MigrationInterface, QueryRunner } from 'typeorm';

export class FilesModule1773798540972 implements MigrationInterface {
  name = 'FilesModule1773798540972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaborators\` ADD \`file1\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`file1\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`file2\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`file3\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`file4\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`file5\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`file5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`file4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`file3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`file2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`file1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaborators\` DROP COLUMN \`file1\``,
    );
  }
}
