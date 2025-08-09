import { MigrationInterface, QueryRunner } from "typeorm";

export class Resources1754746670282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.recursos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.recursos`);
    }

}
