import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkflowState1754055830452 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.flujo_estado (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100)
            );
        `);

        await queryRunner.query(`
            COMMENT ON COLUMN alta_demanda.flujo_estado.nombre IS 'Nombre del flujo';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.flujo_estado`)
    }

}
