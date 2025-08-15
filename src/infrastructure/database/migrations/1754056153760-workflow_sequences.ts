import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkflowSequences1754056153760 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.flujo_secuencia (
                id SERIAL PRIMARY KEY,
                flujo_id INTEGER NOT NULL,
                CONSTRAINT fk_rol FOREIGN KEY (flujo_id) REFERENCES alta_demanda.flujo(id),
                estado_origen INTEGER NOT NULL REFERENCES alta_demanda.flujo_estado(id),
                estado_destino INTEGER NOT NULL REFERENCES alta_demanda.flujo_estado(id),
                accion VARCHAR(50) NOT NULL,
                rol_id INTEGER REFERENCES rol_tipo(id),
                CONSTRAINT chk_estados_diferentes CHECK (estado_origen <> estado_destino)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.flujo_secuencia`)
    }

}
