
export class EducationalInstitutionCourse {
  constructor(
    public readonly educationalInstitutionId: number,
    public readonly level: number,
    public readonly grade: number,
    public readonly parallel: number
  ) {}
}