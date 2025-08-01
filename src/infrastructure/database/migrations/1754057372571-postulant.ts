import { MigrationInterface, QueryRunner } from "typeorm";

export class Postulant1754057372571 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.postulante (
                id SERIAL PRIMARY KEY,
                carnet_identidad VARCHAR(20),
                paterno VARCHAR(50),
                materno VARCHAR(50),
                nombre VARCHAR(100),
                fecha_nacimiento DATE,
                lugar_nacimiento VARCHAR(100),
                genero VARCHAR(2),
                codigo_rude VARCHAR(255)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.postulante`)
    }

}
