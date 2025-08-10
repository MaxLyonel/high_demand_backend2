import { MigrationInterface, QueryRunner } from "typeorm";

export class HighDemandCourse1754060880806 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.alta_demanda_curso (
                id SERIAL PRIMARY KEY,
                inscripcion_alta_demanda_id BIGINT REFERENCES alta_demanda.inscripcion_alta_demanda(id),
                nivel_id BIGINT REFERENCES nivel_tipo(id),
                grado_id BIGINT REFERENCES grado_tipo(id),
                paralelo_id varchar  REFERENCES paralelo_tipo(id),
                plazas_totales INT,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURREN_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.alta_demanda_curso`);
    }

}
