import { MigrationInterface, QueryRunner } from "typeorm";

export class NewRole1774750215426 implements MigrationInterface {
    name = 'NewRole1774750215426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('none', 'admin', 'user', 'candidate') NOT NULL DEFAULT 'none'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('none', 'admin', 'user') NOT NULL DEFAULT 'none'`);
    }

}
