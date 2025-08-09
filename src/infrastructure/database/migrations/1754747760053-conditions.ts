import { MigrationInterface, QueryRunner } from "typeorm";

export class Conditions1754747760053 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE operador_enum AS ENUM ('=', '!=', '>', '<', '>=', '<=', 'in');
        `);

        await queryRunner.query(`
            CREATE TABLE alta_demanda.condiciones (
                id SERIAL PRIMARY KEY,
                campo VARCHAR,
                valor VARCHAR,
                OPERADOR operador_enum NOT NULL
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.acciones`)
    }

}
