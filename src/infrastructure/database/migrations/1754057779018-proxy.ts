import { MigrationInterface, QueryRunner } from "typeorm";

export class Proxy1754057779018 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.apoderado (
                id SERIAL PRIMARY KEY,
                carnet_identidad VARCHAR(20) NOT NULL,
                complemento VARCHAR(10),
                paterno VARCHAR(50),
                materno VARCHAR(50),
                nombre VARCHAR(100) NOT NULL,
                fecha_nacimiento DATE NOT NULL,
                nacionalidad BOOLEAN NOT NULL DEFAULT FALSE,
                parentesco_tipo_id BIGINT REFERENCES alta_demanda.parentesco(id),
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP DEFAULT NULL
            )
        `)
        // await queryRunner.query(`
        //     -- Índice para evitar CI duplicados con complemento
        //     CREATE UNIQUE INDEX apoderado_ci_complemento_uk
        //         ON alta_demanda.apoderado(carnet_identidad, complemento);
        // `)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta.demanda_apoderado`)
    }

}
