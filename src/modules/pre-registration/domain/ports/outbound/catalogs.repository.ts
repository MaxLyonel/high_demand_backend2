

export abstract class CatalogsRepository {
  abstract getRelationship(): Promise<any>;
  abstract getMunicipies(): Promise<any>;
  abstract getCriterias(): Promise<any>
  abstract getLevels(): Promise<any>;
  abstract getDepartments(): Promise<any>;
}