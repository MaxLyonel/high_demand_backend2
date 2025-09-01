import { PermissionService } from "@access-control/application/ports/inbound/permission.service";
import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";


@Controller('permission')
export class PermissionController {

  constructor(
    private readonly permissionService: PermissionService
  ){}

  @Get('actions')
  async getActions() {
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
  async getResources() {
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

  @Post('create')
  async createPermission(@Body() body: any) {
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

  @Get('operators')
  async getOperators() {
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
  async getFields() {
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

  @Post('change-active')
  async changeActivePermission(@Body() body: any) {
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
}