import { MigrationInterface, QueryRunner } from "typeorm";

export class Permissions1754746912111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.permisos (
                id SERIAL PRIMARY KEY,
                accion_id INTEGER NOT NULL,
                recurso_id INTEGER NOT NULL,
                activo BOOLEAN DEFAULT TRUE,
                descripcion VARCHAR,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eliminado_en TIMESTAMP NULL,
                CONSTRAINT fk_accion FOREIGN KEY (accion_id) REFERENCES alta_demanda.acciones(id) ON DELETE CASCADE,
                CONSTRAINT fk_recurso FOREIGN KEY (recurso_id) REFERENCES alta_demanda.recursos(id) ON DELETE CASCADE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.permisos`)
    }

}
