import { MigrationInterface, QueryRunner } from 'typeorm';

export class DistrictModule1775920360779 implements MigrationInterface {
  name = 'DistrictModule1775920360779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`district\` (\`uuid\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD \`district_uuid\` uuid NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` ADD CONSTRAINT \`FK_48f1b9bda097036dfd5bc4292f1\` FOREIGN KEY (\`district_uuid\`) REFERENCES \`district\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP FOREIGN KEY \`FK_48f1b9bda097036dfd5bc4292f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`neighborhood\` DROP COLUMN \`district_uuid\``,
    );
    await queryRunner.query(`DROP TABLE \`district\``);
  }
}
