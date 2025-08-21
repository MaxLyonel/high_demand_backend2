import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkRepresentative1755782690220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.trabajo_apoderado (
                id SERIAL PRIMARY KEY,
                apoderado_id INT REFERENCES alta_demanda.apoderado(id),
                municipio_id INTEGER REFERENCES lugar_tipo(id),
                area TEXT,
                nombre_lugar_trabajo TEXT,
                direccion TEXT,
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
