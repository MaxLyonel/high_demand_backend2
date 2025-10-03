import { MigrationInterface, QueryRunner } from "typeorm";

export class PreRegistrationLocation1758890423675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TYPE alta_demanda.tipo_ubicacion_enum AS ENUM (
                'LUGAR TRABAJO',
                'VIVIENDA'
            )
        `)

        await queryRunner.query(`
            CREATE TABLE alta_demanda.pre_inscripcion_ubicacion (
                id SERIAL PRIMARY KEY,
                pre_inscripcion_id BIGINT REFERENCES alta_demanda.pre_inscripcion(id),
                municipio_id BIGINT REFERENCES lugar_tipo(id) NOT NULL,
                zona_villa VARCHAR(255),
                avenida_calle_nro VARCHAR(255),
                telefono_celular VARCHAR(15),
                tipo alta_demanda.tipo_ubicacion_enum NOT NULL,
                nombre_trabajo_lugar VARCHAR(255),
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
