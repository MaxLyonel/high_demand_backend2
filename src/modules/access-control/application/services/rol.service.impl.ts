// framework nestjs
import { Injectable } from "@nestjs/common";
// own implementations
import { Rol } from "@access-control/domain/models/rol.model";
import { RolService } from "../../domain/ports/inbound/rol.service";
import { RolRepository } from "../../domain/ports/outbound/rol.repository";

@Injectable()
export class RolServiceImpl implements RolService {

  constructor(
    private readonly rolRepository: RolRepository
  ) {}

  async getRoles(): Promise<Rol[]> {
    const result = await this.rolRepository.find()
    return result
  }
}