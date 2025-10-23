import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityLog1761253541292 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE alta_demanda.activity_log (
                id SERIAL PRIMARY KEY,
                user_id INT NULL,
                entity VARCHAR(255) NOT NULL,
                entity_id INT,
                action VARCHAR(50) NOT NULL,
                details JSON NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
