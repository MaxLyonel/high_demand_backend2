import { MigrationInterface, QueryRunner } from "typeorm";

export class HighDemand1754060834448 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE alta_demanda.estado_inscripcion_enum AS ENUM ('ANULADO','REGISTRADO','OBSERVADO','APROBADO','RECHAZADO');
        `)

        await queryRunner.query(`
            CREATE TABLE alta_demanda.inscripcion_alta_demanda (
                id SERIAL PRIMARY KEY,
                institucion_educativa_id BIGINT REFERENCES institucioneducativa(id),
                usuario_id BIGINT REFERENCES usuario(id),
                rol_id INTEGER REFERENCES rol_tipo(id),
                flujo_id BIGINT REFERENCES alta_demanda.flujo(id),
                flujo_estado_id BIGINT REFERENCES alta_demanda.flujo_estado(id),
                bandeja_estado BOOLEAN,
                inscripcion_estado alta_demanda.estado_inscripcion_enum NOT NULL,
                operativo_id INTEGER REFERENCES alta_demanda.operativo(id) NOT NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.inscripcion_alta_demanda`);
    }

}
