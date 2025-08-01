import { MigrationInterface, QueryRunner } from "typeorm";

export class HighDemand1754060834448 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.inscripcion_alta_demanda (
                id SERIAL PRIMARY KEY,
                institucion_educativa_id BIGINT REFERENCES institucioneducativa(id),
                usuario_id BIGINT REFERENCES usuario(id),
                flujo_id BIGINT REFERENCES alta_demanda.flujo(id),
                flujo_estado_actual BIGINT REFERENCES alta_demanda.flujo_estado(id),
                bandeja_estado BOOLEAN,
                estado_inscripcion BOOLEAN
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.inscripcion_alta_demanda`);
    }

}
