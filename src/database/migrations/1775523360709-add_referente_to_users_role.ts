import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferenteToUsersRole1775523360709 implements MigrationInterface {
    name = 'AddReferenteToUsersRole1775523360709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('none', 'admin', 'user', 'candidate', 'referente') NOT NULL DEFAULT 'none'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('none', 'admin', 'user', 'candidate') NOT NULL DEFAULT 'none'`);
    }

}
