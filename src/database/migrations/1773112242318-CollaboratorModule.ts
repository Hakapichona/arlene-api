import { MigrationInterface, QueryRunner } from 'typeorm';

export class CollaboratorModule1773112242318 implements MigrationInterface {
  name = 'CollaboratorModule1773112242318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`collaborators\` (\`uuid\` uuid NOT NULL, \`full_name\` varchar(255) NOT NULL, \`dni\` varchar(255) NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`address\` varchar(255) NULL, \`politics_role\` enum ('referente', 'coordinador', 'delegado', 'voluntario') NOT NULL DEFAULT 'referente', \`status\` enum ('activo', 'inactivo') NOT NULL DEFAULT 'activo', \`main_problem\` varchar(255) NULL, \`requirements\` varchar(255) NULL, \`interaction_history\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`neighborhood_id\` uuid NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`collaborators\` ADD CONSTRAINT \`FK_7440c3171d639bc0f037d9244a5\` FOREIGN KEY (\`neighborhood_id\`) REFERENCES \`neighborhood\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`collaborators\` DROP FOREIGN KEY \`FK_7440c3171d639bc0f037d9244a5\``,
    );
    await queryRunner.query(`DROP TABLE \`collaborators\``);
  }
}
