import { MigrationInterface, QueryRunner } from "typeorm";

export class Relationship1754057639703 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.parentesco (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(50),
                activo BOOLEAN DEFAULT TRUE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.parentesco`)
    }

}
