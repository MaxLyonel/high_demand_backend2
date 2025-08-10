import e from "express"

export class Teacher {
  constructor(
    public readonly id: number,
    public readonly positionTypeId: number,
    public readonly educationalInstitutionId: number,
    public readonly personId: number,
    public readonly gestionId: number,
    public readonly isVigentAdmin: boolean
  ) {}

  static create({
    id,
    positionTypeId,
    educationalInstitutionId,
    personId,
    gestionId,
    isVigentAdmin
  }: {
    id: number,
    positionTypeId: number,
    educationalInstitutionId: number,
    personId: number,
    gestionId: number,
    isVigentAdmin: boolean
  }): Teacher {
    return new Teacher(id, positionTypeId, educationalInstitutionId, personId, gestionId, isVigentAdmin)
  }
}