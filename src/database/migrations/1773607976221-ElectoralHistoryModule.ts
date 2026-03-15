import { MigrationInterface, QueryRunner } from 'typeorm';

export class ElectoralHistoryModule1773607976221 implements MigrationInterface {
  name = 'ElectoralHistoryModule1773607976221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`electoral_histories\` (\`uuid\` uuid NOT NULL, \`electoral_year\` int NOT NULL, \`number_of_votes\` int NOT NULL, \`description\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`neighborhood_uuid\` uuid NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`electoral_histories\` ADD CONSTRAINT \`FK_5005e79f59640314097eeb27e15\` FOREIGN KEY (\`neighborhood_uuid\`) REFERENCES \`neighborhood\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`electoral_histories\` DROP FOREIGN KEY \`FK_5005e79f59640314097eeb27e15\``,
    );
    await queryRunner.query(`DROP TABLE \`electoral_histories\``);
  }
}
