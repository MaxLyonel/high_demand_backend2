import { MigrationInterface, QueryRunner } from "typeorm";

export class RolPermissions1754747637101 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.rol_permisos (
                rol_id INTEGER NOT NULL,
                permiso_id INTEGER NOT NULL,
                activo BOOLEAN DEFAULT TRUE,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                creado_por INTEGER NULL,
                PRIMARY KEY (rol_id, permiso_id),
                CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES rol_tipo(id) ON DELETE CASCADE,
                CONSTRAINT fk_permiso FOREIGN KEY (permiso_id) REFERENCES alta_demanda.permisos(id) ON DELETE CASCADE,
                CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES usuario(id) ON DELETE SET NULL
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE alta_demanda.rol_permisos`)
    }

}
