



export abstract class EducationalInstitutionConsolidationService {
  abstract consolidateEducationalInstitution(sie: number): Promise<any>;
  abstract checkConsolidation(sie: number): Promise<any>;
}