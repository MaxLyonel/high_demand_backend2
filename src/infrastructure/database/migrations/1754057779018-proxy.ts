import { MigrationInterface, QueryRunner } from "typeorm";

export class Proxy1754057779018 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.apoderado (
                id SERIAL PRIMARY KEY,
                carnet_identidad VARCHAR(20),
                paterno VARCHAR(50),
                materno VARCHAR(50),
                nombre VARCHAR(100),
                celular INT,
                parentesco_tipo_id BIGINT REFERENCES alta_demanda.parentesco(id)
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta.demanda_apoderado`)
    }

}
