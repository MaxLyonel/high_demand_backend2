import { Body, Controller, Post } from "@nestjs/common";


@Controller('high-demand')
export class HighDemandController {
  constructor() {}

  @Post('create-high-demand')
  createHighDemandRegistration(@Body() body: any ) {
    return 'creado'
  }
}