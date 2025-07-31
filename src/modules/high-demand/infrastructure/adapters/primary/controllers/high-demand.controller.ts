import { Body, Controller, Post } from "@nestjs/common";
import { HighDemandService } from "src/modules/high-demand/application/ports/inbound/high-demand.service";


@Controller('high-demand')
export class HighDemandController {
  constructor(
    private readonly highDemandService: HighDemandService
  ) {}

  @Post('create-high-demand')
  createHighDemandRegistration(@Body() body: any ) {
    return this.highDemandService.saveHighDemandRegistration(body)
  }
}