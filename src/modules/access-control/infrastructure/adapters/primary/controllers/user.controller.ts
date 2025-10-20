import { AbilityFactory } from "@access-control/application/services/ability.factory";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LoginRequestDto } from "../dtos/request/login-request.dto";


@Controller('user')
export class UserController {
  constructor(private abilityFactory: AbilityFactory) {}

  @Get('abilities')
  @UseGuards(JwtAuthGuard)
  async getAbilities(@Req() req: LoginRequestDto) {
    const user = req.user
    const roleId = user.roles[0].role.id
    const ability = await this.abilityFactory.createForRole(roleId, user.id)
    return { rules: ability.rules }
  }
}
