import { MigrationInterface, QueryRunner } from "typeorm";

export class PreRegistrationBrother1758890401786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.pre_inscripcion_hermano (
                id SERIAL PRIMARY KEY,
                pre_inscripcion_id BIGINT REFERENCES alta_demanda.pre_inscripcion(id),
                codigo_rude VARCHAR NOT NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
