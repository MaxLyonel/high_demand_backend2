

export abstract class EducationalInstitutionConsolidationRepository {
  abstract consolidate(sie: number): Promise<boolean>;
  abstract check(sie: number): Promise<boolean>
}