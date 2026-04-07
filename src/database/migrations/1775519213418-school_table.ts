import { MigrationInterface, QueryRunner } from "typeorm";

export class SchoolTable1775519213418 implements MigrationInterface {
    name = 'SchoolTable1775519213418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`school_table\` (\`uuid\` uuid NOT NULL, \`table_number\` int NOT NULL, \`school_uuid\` uuid NULL, \`collaborator_uuid\` uuid NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`collaborators\` DROP COLUMN \`user_uuid\``);
        await queryRunner.query(`ALTER TABLE \`collaborators\` DROP COLUMN \`profile_photo_url\``);
        await queryRunner.query(`ALTER TABLE \`collaborators\` DROP COLUMN \`ci_photo_url\``);
        await queryRunner.query(`ALTER TABLE \`paths\` DROP COLUMN \`photo_url\``);
        await queryRunner.query(`ALTER TABLE \`neighborhood\` DROP COLUMN \`photo_url\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`profile_photo_url\``);
        await queryRunner.query(`ALTER TABLE \`school_table\` ADD CONSTRAINT \`FK_57507a92d27e14f4bfdc51b4657\` FOREIGN KEY (\`school_uuid\`) REFERENCES \`schools\`(\`uuid\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`school_table\` ADD CONSTRAINT \`FK_98f2b491bf3cc152ee20d483a55\` FOREIGN KEY (\`collaborator_uuid\`) REFERENCES \`collaborators\`(\`uuid\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`school_table\` DROP FOREIGN KEY \`FK_98f2b491bf3cc152ee20d483a55\``);
        await queryRunner.query(`ALTER TABLE \`school_table\` DROP FOREIGN KEY \`FK_57507a92d27e14f4bfdc51b4657\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`profile_photo_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`neighborhood\` ADD \`photo_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`paths\` ADD \`photo_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`collaborators\` ADD \`ci_photo_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`collaborators\` ADD \`profile_photo_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`collaborators\` ADD \`user_uuid\` varchar(255) NULL`);
        await queryRunner.query(`DROP TABLE \`school_table\``);
    }

}
