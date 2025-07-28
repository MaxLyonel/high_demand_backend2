export class EducationalInstitutionCourse {
  constructor(
    public readonly id: number,
    public readonly educationalInstitutionId: number,
    public readonly levelTypeId: number,
    public readonly gradeTypeId: number,
    public readonly parallelTypeId: number,
    public readonly gestionTypeId: number
  ) {}

  static create({
    id,
    educationalInstitutionId,
    levelTypeId,
    gradeTypeId,
    parallelTypeId,
    gestionTypeId
  }: {
    id: number,
    educationalInstitutionId: number,
    levelTypeId: number,
    gradeTypeId: number,
    parallelTypeId: number,
    gestionTypeId: number
  }): EducationalInstitutionCourse {
    return new EducationalInstitutionCourse(id, educationalInstitutionId, levelTypeId, gradeTypeId, parallelTypeId, gestionTypeId)
  }
}