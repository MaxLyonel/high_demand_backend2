import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkflowSequences1754056153760 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.flujo_secuencia (
                id SERIAL PRIMARY KEY,
                estado_actual BIGINT REFERENCES alta_demanda.flujo_estado(id),
                estado_anterior BIGINT REFERENCES alta_demanda.flujo_estado(id)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.flujo_secuencia`)
    }

}
