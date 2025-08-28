import { MigrationInterface, QueryRunner } from "typeorm";

export class PreRegistration1754060916679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TYPE alta_demanda.estado_pre_inscripcion_enum AS ENUM (
                'INVALIDADO',
                'VALIDADO',
                'REGISTRADO',
                'ACEPTADO',
                'NO ACEPTADO'
            )
        `)

        await queryRunner.query(`
            CREATE TABLE alta_demanda.pre_inscripcion (
                id SERIAL PRIMARY KEY,
                alta_demanda_curso_id BIGINT REFERENCES alta_demanda.alta_demanda_curso(id),
                apoderado_id BIGINT REFERENCES alta_demanda.apoderado(id),
                postulante_id BIGINT REFERENCES alta_demanda.postulante(id),
                criterio_id BIGINT REFERENCES alta_demanda.criterio(id),
                estado alta_demanda.estado_pre_inscripcion_enum NOT NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.pre_inscripcion`);
        await queryRunner.query(`DROP TYPE alta_demanda.estado_pre_inscripcion_enum`);
    }
}
