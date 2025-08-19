import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { CatalogsService } from "src/modules/pre-registration/domain/ports/inbound/catalogs.service";



@Controller('catalogs')
export class CatalogsController {

  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  @Get('list-relationship')
  async getRelationships() {
    try {
      const result = await this.catalogsService.listRelationship()
      return {
        status: 'success',
        message: 'Catálogo de parentesco obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de parentesco'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-criterias')
  async getCriterias() {
    try {
      const result = await this.catalogsService.listCriterias()
      return {
        status: 'success',
        message: 'Catálogo de criterios obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de criterios'
      }, HttpStatus.BAD_REQUEST)
    }
  }

}