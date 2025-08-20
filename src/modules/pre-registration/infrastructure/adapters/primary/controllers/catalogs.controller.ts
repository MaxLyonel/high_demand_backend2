import { Controller, Get, HttpException, HttpStatus, Query } from "@nestjs/common";
import { StudentService } from "@pre-registration/domain/ports/inbound/student.service";
import { CatalogsService } from "src/modules/pre-registration/domain/ports/inbound/catalogs.service";



@Controller('catalogs')
export class CatalogsController {

  constructor(
    private readonly catalogsService: CatalogsService,
    private readonly studentService: StudentService
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

  @Get('list-municipies')
  async getMunicipies() {
    try {
      const result = await this.catalogsService.listMunicipies()
      return {
        status: 'success',
        message: 'Catálogo de criterios obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de municipios'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('search-student')
  async searchStudent(@Query() query: any) {
    try {
      const { sie, codeRude } = query
      const result = await this.studentService.searchByRude(sie, codeRude)
      if(result) {
        return {
          status: 'success',
          message: 'Estudiante encontrado exitosamente',
          data: result
        }
      } else {
        return {
          status: 'success',
          message: 'No se encontró al estudiante',
          data: []
        }
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al buscar al estudiante'
      }, HttpStatus.BAD_REQUEST)
    }
  }

}