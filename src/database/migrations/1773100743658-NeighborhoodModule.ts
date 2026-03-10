import { MigrationInterface, QueryRunner } from 'typeorm';

export class NeighborhoodModule1773100743658 implements MigrationInterface {
  name = 'NeighborhoodModule1773100743658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`neighborhood\` (\`uuid\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`name_code\` varchar(255) NULL, \`estimated_population\` int NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`description\` longtext NULL, \`contact_name\` varchar(255) NULL, \`contact_email\` varchar(255) NULL, \`contact_phone\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_e6493314c9825dcc41aea64d0a\` (\`name_code\`), PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e6493314c9825dcc41aea64d0a\` ON \`neighborhood\``,
    );
    await queryRunner.query(`DROP TABLE \`neighborhood\``);
  }
}
