import { MigrationInterface, QueryResult, QueryRunner } from "typeorm";

export class HistoryPreRegistration1756387900362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.historial_pre_inscripcion (
                id SERIAL PRIMARY KEY,
                pre_inscripcion_id BIGINT REFERENCES alta_demanda.pre_inscripcion(id) NOT NULL,
                user_id INTEGER REFERENCES usuario(id),
                rol_id INTEGER REFERENCES rol_tipo(id) NOT NULL,
                estado alta_demanda.estado_pre_inscripcion_enum NOT NULL,
                observacion VARCHAR,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
