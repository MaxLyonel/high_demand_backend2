import { MigrationInterface, QueryRunner } from "typeorm";

export class HighDemandCourse1754060880806 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.alta_demanda_curso (
                id SERIAL PRIMARY KEY,
                inscripcion_alta_demanda_id BIGINT REFERENCES alta_demanda.inscripcion_alta_demanda(id),
                institucion_educativa_curso_id BIGINT REFERENCES institucioneducativa_curso(id),
                plazas_totales INT
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.alta_demanda_curso`);
    }

}
