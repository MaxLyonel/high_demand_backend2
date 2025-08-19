import { MigrationInterface, QueryRunner } from "typeorm";

export class Criterion1754057187517 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.criterio (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100),
                descripcion VARCHAR(255),
                activo BOOLEAN DEFAULT TRUE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.criterio`)
    }

}
