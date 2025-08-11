// framework nestjs
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
// own implementations
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service"


@Controller('high-demand')
export class HighDemandController {
  constructor(
    private readonly highDemandService: HighDemandService
  ) {}

  @Post('create-high-demand')
  createHighDemandRegistration(@Body() body: any ) {
    return this.highDemandService.saveHighDemandRegistration(body)
  }

  @Get(':id/by-institution')
  getHighDemandByInstitution(@Param('id') id: number) {
    return this.highDemandService.getHighDemandRegistration(id)
  }
}