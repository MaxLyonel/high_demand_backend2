import { Controller, Get, Param } from "@nestjs/common";
import { EducationalInstitutionService } from "src/modules/high-demand/application/ports/inbound/educational-institution.service";

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