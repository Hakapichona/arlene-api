import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchoolsModule1773691175781 implements MigrationInterface {
  name = 'SchoolsModule1773691175781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`schools\` (\`uuid\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NULL, \`number_of_boxes\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`neighborhood_uuid\` uuid NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`schools\` ADD CONSTRAINT \`FK_a9d62aef1159df24862215259cb\` FOREIGN KEY (\`neighborhood_uuid\`) REFERENCES \`neighborhood\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`schools\` DROP FOREIGN KEY \`FK_a9d62aef1159df24862215259cb\``,
    );
    await queryRunner.query(`DROP TABLE \`schools\``);
  }
}
