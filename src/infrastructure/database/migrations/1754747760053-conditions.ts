import { MigrationInterface, QueryRunner } from "typeorm";

export class Conditions1754747760053 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE alta_demanda.operador_enum AS ENUM ('=', '!=', '>', '<', '>=', '<=', 'in');
        `);

        await queryRunner.query(`
            CREATE TABLE alta_demanda.condiciones (
                id SERIAL PRIMARY KEY,
                campo VARCHAR,
                valor VARCHAR,
                operador alta_demanda.operador_enum NOT NULL,
                permiso_id INTEGER NOT NULL,
                CONSTRAINT fk_permiso FOREIGN KEY (permiso_id) REFERENCES alta_demanda.permisos(id) ON DELETE CASCADE
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.acciones`)
    }

}
