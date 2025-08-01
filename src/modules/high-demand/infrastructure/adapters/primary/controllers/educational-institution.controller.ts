// framework nestjs
import { Controller, Get, Param } from "@nestjs/common";
// own implementations
import { EducationalInstitutionService } from "@high-demand/application/ports/inbound/educational-institution.service"

@Controller('educational-institution')
export class EducationalInstitutionController {
  constructor(
    private readonly educationalInstitutionService: EducationalInstitutionService
  ){}

  @Get('info/:sie')
  getEducationalInstitutionInfo(@Param('sie') sie: number) {
    return this.educationalInstitutionService.getInfoEducationalInstitution(sie)
  }
}