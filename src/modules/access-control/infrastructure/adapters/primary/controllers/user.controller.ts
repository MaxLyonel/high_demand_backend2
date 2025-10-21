import { AbilityFactory } from "@access-control/application/services/ability.factory";
import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LoginRequestDto } from "../dtos/request/login-request.dto";


@Controller('user')
export class UserController {
  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    private abilityFactory: AbilityFactory
  ) {}

  @Get('abilities')
  @UseGuards(JwtAuthGuard)
  // async getAbilities(@Req() req: LoginRequestDto) {
  async getAbilities(@Req() req: any) {
    const user = req.user
    const selectedRoleId = Number(req.headers['x-selected-role-id']);
    const institutionIdHeader = req.headers['x-institution-id'];
    const institutionId = institutionIdHeader !== undefined ? Number(institutionIdHeader) : null;
    const placeTypeId = req.headers['x-place-type-id'] !== undefined ? Number(req.headers['x-place-type-id']) : null;
    const ability = await this.abilityFactory.createForRole(selectedRoleId, user.id, institutionId, placeTypeId, this.constants.CURRENT_YEAR)
    return { rules: ability.rules }
  }
}
