import { MigrationInterface, QueryRunner } from "typeorm";

export class History1754885059661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.historial (
                id SERIAL PRIMARY KEY,
                inscripcion_alta_demanda_id INTEGER REFERENCES alta_demanda.inscripcion_alta_demanda(id) NOT NULL,
                flujo_estado_id INTEGER REFERENCES alta_demanda.flujo_estado(id) NOT NULL,
                estado_inscripcion alta_demanda.estado_inscripcion_enum NOT NULL,
                user_id INTEGER REFERENCES usuario(id) NOT NULL,
                observacion VARCHAR(100),
                creado_en TIMESTAMP DEFAULT NOW(),
                actualizado_en TIMESTAMP DEFAULT NOW()
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE historial`)
    }

}
