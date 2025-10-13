import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Query, Res, UseInterceptors } from "@nestjs/common";
import { StudentService } from "@pre-registration/domain/ports/inbound/student.service";
import { PdfService } from "@pre-registration/domain/ports/outbound/pdf.service";
import { Response } from "express";
import { CatalogsService } from "src/modules/pre-registration/domain/ports/inbound/catalogs.service";



@Controller('catalogs')
export class CatalogsController {

  constructor(
    private readonly catalogsService: CatalogsService,
    private readonly studentService: StudentService,
    private readonly pdfService: PdfService
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

  @Get('search-student/:codeRude')
  async searchStudentByRUDE(@Param('codeRude') codeRude: string) {
    try {
      const result = await this.studentService.searchByRUDE(codeRude)
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
          data: {}
        }
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener al estudiante por código rude'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-levels')
  async getLevels() {
    try {
      const result = await this.catalogsService.listLevels()
      return {
        status: 'success',
        message: 'Obtención exitosa de los niveles',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los niveles'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('list-departments')
  async getDepartments() {
    try {
      const result = await this.catalogsService.listDepartments()
      return {
        status: 'success',
        message: 'Obtención exitosa de los departamentos',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los departamentos'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('print')
  async print(@Res() res: Response) {
    try {
      console.log("Solicitud PDF recibida");
      // ✅ Solo llamar al servicio, sin return
      await this.pdfService.generateRegistrationForm({ campo: 1 }, res);
      // return "Hola"
      console.log("PDF enviado exitosamente");
    } catch(error) {
      console.error('Error generando PDF:', error);
      // ✅ Solo enviar error si los headers no se enviaron
      if (!res.headersSent) {
        // Puedes usar throw o res.status().json()
        res.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: error.message || 'Error al descargar PDF'
        });
      } else {
        // Si ya se enviaron headers, solo logear el error
        console.error('Error después de enviar headers PDF');
      }
    }
  }

}