import { Injectable } from "@nestjs/common";
import { CatalogsService } from "../../domain/ports/inbound/catalogs.service";
import { CatalogsRepository } from "../../domain/ports/outbound/catalogs.repository";



@Injectable()
export class CatalogsServiceImpl implements CatalogsService {

  constructor(
    private readonly catalogRepository: CatalogsRepository
  ) {}

  async listRelationship(): Promise<any> {
    const relationships = await this.catalogRepository.getRelationship()
    return relationships
  }

  async listCriterias(): Promise<any> {
    const criterias = await this.catalogRepository.getCriterias()
    return criterias
  }

  async listMunicipies(): Promise<any> {
    const municipies = await this.catalogRepository.getMunicipies()
    return municipies
  }
}