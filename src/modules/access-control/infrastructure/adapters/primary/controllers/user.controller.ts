import { AbilityFactory } from "@access-control/application/services/ability.factory";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LoginRequestDto } from "../dtos/request/login-request.dto";


@Controller('user')
export class UserController {
  constructor(private abilityFactory: AbilityFactory) {}

  @Get('abilities')
  @UseGuards(JwtAuthGuard)
  // async getAbilities(@Req() req: LoginRequestDto) {
  async getAbilities(@Req() req: any) {
    const user = req.user
    const selectedRoleId = Number(req.headers['x-selected-role-id']);
    const institutionIdHeader = req.headers['x-institution-id'];
    const institutionId = institutionIdHeader !== undefined ? Number(institutionIdHeader) : null;
    const placeTypeId = req.headers['x-place-type-id'] !== undefined ? Number(req.headers['x-place-type-id']) : null;
    // const roleId = user.roles[0].role.id
    const ability = await this.abilityFactory.createForRole(selectedRoleId, user.id, institutionId, placeTypeId)
    console.log(ability.rules)
    return { rules: ability.rules }
  }
}
