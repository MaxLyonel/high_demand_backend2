import { HighDemandCourseRepository } from "./high-demand-course.repository";
import { HighDemandRepository } from "./high-demand.repository";

export abstract class UnitOfWork {
  abstract start<T>(work: () => Promise<T>): Promise<T>;
}

export interface TransactionContext {
  highDemandRepository: HighDemandRepository;
  highDemandCourseRepository: HighDemandCourseRepository;
  // ...otros repos que se usen en la transacción
}
