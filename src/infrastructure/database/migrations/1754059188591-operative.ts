import { MigrationInterface, QueryRunner } from "typeorm";

export class Operative1754059188591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.operativo (
                id SERIAL PRIMARY KEY,
                fec_pos_ue_ini TIMESTAMP,
                fec_pos_ue_fin TIMESTAMP,
                fec_rev_dis_ini TIMESTAMP,
                fec_rev_dis_fin TIMESTAMP,
                fec_rev_dep_ini TIMESTAMP,
                fec_rev_dep_fin TIMESTAMP,
                fec_ope_ini TIMESTAMP,
                fec_ope_fin TIMESTAMP,
                fecha_sorteo_ini TIMESTAMP,
                fecha_sorteo_fin TIMESTAMP,
                gestion_id INT,
                es_activo BOOLEAN DEFAULT TRUE
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE operativo`)
    }

}
