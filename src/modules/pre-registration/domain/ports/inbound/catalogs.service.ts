

export abstract class CatalogsService {
  abstract listRelationship(): Promise<any>;
  abstract listMunicipies(): Promise<any>;
  abstract listCriterias(): Promise<any>;
  abstract listLevels(): Promise<any>;
  abstract listDepartments(): Promise<any>;
}