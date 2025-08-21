import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentResidence1755784225064 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.postulante_residencia (
                id SERIAL PRIMARY KEY,
                postulante_id INTEGER REFERENCES alta_demanda.postulante(id),
                municipio_id INTEGER REFERENCES lugar_tipo(id),
                zona_villa TEXT,
                avenida_calle_nro TEXT,
                telefono TEXT,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
