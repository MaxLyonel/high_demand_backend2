import { Rol } from "@access-control/domain/models/rol.model";
import { RolService } from "../ports/inbound/rol.service";
import { Injectable } from "@nestjs/common";
import { RolRepository } from "../ports/outbound/rol.repository";

@Injectable()
export class RolServiceImpl implements RolService {

  constructor(
    private readonly rolRepository: RolRepository
  ) {}

  async getRoles(): Promise<Rol[]> {
    const result = await this.rolRepository.find()
    return result
  }

  getRol(id: number): Promise<Rol> {
    throw new Error("Method not implemented.");
  }

}