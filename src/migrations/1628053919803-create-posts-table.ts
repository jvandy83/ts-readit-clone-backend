import {MigrationInterface, QueryRunner} from "typeorm";

export class createPostsTable1628053919803 implements MigrationInterface {
    name = 'createPostsTable1628053919803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_9182666411411fa6ae9f11fe268"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "Subname" TO "subname"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_a88ff3dbe3acc9ddfe428f12b4a" FOREIGN KEY ("subname") REFERENCES "subs"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_a88ff3dbe3acc9ddfe428f12b4a"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "subname" TO "Subname"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_9182666411411fa6ae9f11fe268" FOREIGN KEY ("Subname") REFERENCES "subs"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
