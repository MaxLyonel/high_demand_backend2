// framework nestjs
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
// own implementations
import { EducationalInstitutionService } from "@high-demand/domain/ports/inbound/educational-institution.service"
import { EducationalInstitutionConsolidationService } from '../../../../domain/ports/inbound/educational-institution-consolidation.service';

@Controller('educational-institution')
export class EducationalInstitutionController {
  constructor(
    private readonly educationalInstitutionService: EducationalInstitutionService,
    private readonly educationalInstitutionConsolidationService: EducationalInstitutionConsolidationService
  ){}

  @Get('info/:sie')
  getEducationalInstitutionInfo(@Param('sie') sie: number) {
    return this.educationalInstitutionService.getInfoEducationalInstitution(sie)
  }

  @Get('prueba/:sie')
  search(@Param('sie') sie: number) {
    return this.educationalInstitutionService.searchEducationalInstitutionDistrict(sie)
  }

  @Post('consolidate')
  async consolidateEducationalInstitution(@Body() body: any) {
    try {
      const { sie } = body
      const result = await this.educationalInstitutionConsolidationService.consolidateEducationalInstitution(sie)
      return {
        status: 'success',
        message: 'Consolidación exitosa',
        data: result
      }
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al consolidar la institución educativa',
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('consolidation-status/:sie')
  async checkConsolidationStatus(@Param('sie') sie: number) {
    try {
      const result = await this.educationalInstitutionConsolidationService.checkConsolidation(sie)
      return {
        status: 'success',
        message: 'Verificación exitosa',
        data: result
      }
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al verificar consolidación',
      }, HttpStatus.BAD_REQUEST)
    }
  }
}