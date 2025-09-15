import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { PermissionService } from "@access-control/domain/ports/inbound/permission.service";
import { ActionResponseDto } from "../dtos/response/action-response.dto";
import { ResourceResponseDto } from "../dtos/response/resource-response.dto";
import { PermissionsResponseDto } from "../dtos/response/permissions-response.dto";
import { ManagePermissionRequestDto } from "../dtos/request/permission-request.dto";
import { FieldResponseDto } from "../dtos/response/field-response.dto";
import { OperatorResponseDto } from "../dtos/response/operator-response.dto";
import { CreatePermissionResponseDto } from "../dtos/response/create-permission-response.dto";
import { UpdatePermissionResponseDto } from "../dtos/response/update-permission-response.dto";


@Controller('permission')
export class PermissionController {

  constructor(
    private readonly permissionService: PermissionService
  ){}

  @Post('create')
  async createPermission(
    @Body() body: ManagePermissionRequestDto
  ): Promise<CreatePermissionResponseDto> {
    try {
      const result = await this.permissionService.createPermission(body)
      return {
        status: 'success',
        message: 'Se guardo exitosamente el permiso',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al guardar el permiso'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('update')
  async updatePermission(
    @Body() body: ManagePermissionRequestDto
  ): Promise<UpdatePermissionResponseDto> {
    try {
      const result = await this.permissionService.updatePermission(body)
      return {
        status: 'success',
        message: 'Se actualizó exitosamente el permiso',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al guardar el permiso'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('change-active')
  async changeActivePermission(
    @Body() body: ManagePermissionRequestDto & { rolId: number }
  ): Promise<CreatePermissionResponseDto> {
    try {
      const result = await this.permissionService.changePermissionStatus(body)
      return {
        status: 'success',
        message: 'Estado actualizado correctamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Hubo un error al actualizar el estado del permiso'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('all')
  async getPermissions(): Promise<PermissionsResponseDto> {
    try {
      const result = await this.permissionService.getPermissions()
      return {
        status: 'success',
        message: 'Se ha obtenido exitosamente los permisos',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los permisos'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('actions')
  async getActions(): Promise<ActionResponseDto> {
    try {
      const result = await this.permissionService.getActions()
      return {
        status: 'success',
        message: 'Listado de acciones obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de acciones'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('resources')
  async getResources(): Promise<ResourceResponseDto>{
    try {
      const result = await this.permissionService.getResources()
      return {
        status: 'success',
        message: 'Listado de recursos obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener el listado de recursos'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('operators')
  async getOperators(): Promise<OperatorResponseDto>{
    try {
      const result = await this.permissionService.getOperators()
      return {
        status: 'success',
        message: 'Listado de operadores obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Error al obtener los operadores'
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('fields')
  async getFields(): Promise<FieldResponseDto> {
    try {
      const result = await this.permissionService.getFields()
      return {
        status: 'success',
        message: 'Listado de campos obtenido exitosamente',
        data: result
      }
    } catch(error) {
      throw new HttpException({
        status: 'error',
        messag: error.message || 'Error al obtener campos de tablas'
      }, HttpStatus.BAD_REQUEST)
    }
  }
}