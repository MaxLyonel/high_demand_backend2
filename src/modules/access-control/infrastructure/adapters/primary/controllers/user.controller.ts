import { AbilityFactory } from "@access-control/application/services/ability.factory";
import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";


@Controller('user')
export class UserController {
  constructor(private abilityFactory: AbilityFactory) {}

  @Get('abilities')
  @UseGuards(JwtAuthGuard)
  async getAbilities(@Req() req) {
    const user = req.user
    console.log("user obtenido", user)
    const roleId = user.roles[0].id
    const ability = await this.abilityFactory.createForRole(roleId)
    return { rules: ability.rules }
  }
}
