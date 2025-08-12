import { TransactionContext, UnitOfWork } from "@high-demand/domain/ports/outbound/unit-of-work";
import { Inject } from "@nestjs/common";
import { DataSource } from "typeorm";

export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource
  ){}

  async start<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
