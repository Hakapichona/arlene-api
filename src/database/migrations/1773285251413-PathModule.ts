import { MigrationInterface, QueryRunner } from 'typeorm';

export class PathModule1773285251413 implements MigrationInterface {
  name = 'PathModule1773285251413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`paths\` (\`uuid\` uuid NOT NULL, \`date\` datetime NOT NULL, \`observations\` varchar(255) NOT NULL, \`additional_information\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`neighborhood_uuid\` uuid NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paths\` ADD CONSTRAINT \`FK_21ed2dc30c0b1fe41dce3127ef3\` FOREIGN KEY (\`neighborhood_uuid\`) REFERENCES \`neighborhood\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paths\` DROP FOREIGN KEY \`FK_21ed2dc30c0b1fe41dce3127ef3\``,
    );
    await queryRunner.query(`DROP TABLE \`paths\``);
  }
}
