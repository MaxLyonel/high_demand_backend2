import { MigrationInterface, QueryRunner } from "typeorm";

export class Workflow1754056022031 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.flujo (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100),
                activo BOOLEAN DEFAULT TRUE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.flujo`)
    }

}
