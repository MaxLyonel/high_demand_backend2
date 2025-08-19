import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkflowSequences1754056153760 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.flujo_secuencia (
                id SERIAL PRIMARY KEY,
                flujo_id INTEGER NOT NULL,
                CONSTRAINT fk_flujo FOREIGN KEY (flujo_id) REFERENCES alta_demanda.flujo(id),
                estado_actual INTEGER NOT NULL REFERENCES rol_tipo(id),
                estado_siguiente INTEGER NOT NULL REFERENCES rol_tipo(id),
                accion VARCHAR(50) NOT NULL,
                secuencia INTEGER NOT NULL,
                CONSTRAINT chk_estados_diferentes CHECK (estado_actual <> estado_siguiente)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.flujo_secuencia`)
    }

}
