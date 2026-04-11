import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchoolTableModule1775871809936 implements MigrationInterface {
  name = 'SchoolTableModule1775871809936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`school_table\` (\`uuid\` uuid NOT NULL, \`table_number\` int NOT NULL, \`school_uuid\` uuid NULL, \`collaborator_uuid\` uuid NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('none', 'admin', 'user', 'candidate', 'referente') NOT NULL DEFAULT 'none'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`school_table\` ADD CONSTRAINT \`FK_57507a92d27e14f4bfdc51b4657\` FOREIGN KEY (\`school_uuid\`) REFERENCES \`schools\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`school_table\` ADD CONSTRAINT \`FK_98f2b491bf3cc152ee20d483a55\` FOREIGN KEY (\`collaborator_uuid\`) REFERENCES \`collaborators\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`school_table\` DROP FOREIGN KEY \`FK_98f2b491bf3cc152ee20d483a55\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`school_table\` DROP FOREIGN KEY \`FK_57507a92d27e14f4bfdc51b4657\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('none', 'admin', 'user') NOT NULL DEFAULT 'none'`,
    );
    await queryRunner.query(`DROP TABLE \`school_table\``);
  }
}
