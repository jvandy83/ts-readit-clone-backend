import {MigrationInterface, QueryRunner} from "typeorm";

export class createPostsTable1628054349134 implements MigrationInterface {
    name = 'createPostsTable1628054349134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "subname" character varying`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_a88ff3dbe3acc9ddfe428f12b4a" FOREIGN KEY ("subname") REFERENCES "subs"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_a88ff3dbe3acc9ddfe428f12b4a"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "subname"`);
    }

}
