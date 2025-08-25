import { HttpServer, Injectable, Logger } from "@nestjs/common";
import { SegipService } from "@pre-registration/domain/ports/outbound/segip.service";
import { segip } from "@infrastructure-general/config";
import { HttpService } from "@nestjs/axios";
import { map } from "rxjs";
import * as dayjs from "dayjs";


enum CodeResSegipEnum {
  NO_PROCESADO = '0',
  NO_ENCONTRADO = '1',
  ENCONTRADO = '2',
  MULTIPLICIDAD = '3',
  OBSERVADO = '4'
}

enum DataStatesEnum {
  NO_CORRESPONDE = 0,
  CORRESPONDE = 1,
  NO_VERIFICADO = 2
}


@Injectable()
export class SegipServiceImpl implements SegipService {

  private apiUrl: string
  private readonly logger = new Logger(SegipServiceImpl.name)

  constructor(
    private http: HttpService
  ){
    this.apiUrl = segip.segipUrl
  }

  async contrastar(person: any, typeCI: number): Promise<{ finalizado: boolean; mensaje: string; }> {
    try {
      console.log("ingresa aca?", this.apiUrl)
      if(!typeCI) {
        typeCI = 1
      }
      if(person.complemento === undefined) {
        person.complemento = ''
      }
      const fieldData = this.assemblePersonData(person)
      const fields = this.assembleQueryParams(fieldData)
      const urlContrastation = encodeURI(
        `${this.apiUrl}/contrastacion/?lista_campo={ ${fields} }&tipo_persona=${typeCI}`
      )
      const answer = await this.http
        .get(urlContrastation)
        .pipe(map((response) => response.data))
        .toPromise()

      const response = answer?.ConsultaDatoPersonaContrastacionResult
      if(response) {
        if (response.CodigoRespuesta === CodeResSegipEnum.ENCONTRADO) {
          try {
            const datosRespuesta = JSON.parse(response.ContrastacionEnFormatoJson)
            const observaciones = this.processResponse(datosRespuesta)
            const exito = observaciones.length === 0
            const mensaje = exito
              ? response.DescripcionRespuesta
              : `Los siguientes campos no son válidos: ${observaciones.join(', ')} para el carnet ${person.ci}`

            if (exito) {
              this.logger.verbose(
                '\t================ CONTRASTACIÓN EXITOSAMENTE =============================',
              )
            } else {
              this.logger.verbose(
                '\t================ CONTRASTACIÓN FALLIDA  =============================',
              )
            }
            return this.assembleAnswer(exito, mensaje)
          } catch (jsonError) {
            this.logger.error('JSON parse error:', jsonError.message)
            return this.assembleAnswer(false, 'Error processing response data')
          }
        } else if (
          [
            CodeResSegipEnum.NO_PROCESADO,
            CodeResSegipEnum.NO_ENCONTRADO,
            CodeResSegipEnum.MULTIPLICIDAD,
            CodeResSegipEnum.OBSERVADO,
          ].includes(response.CodigoRespuesta)
        ) {
          return this.assembleAnswer(false, `No se encontro el registro para el carnet ${fieldData.NumeroDocumento}`)
        } else {
          return this.assembleAnswer(false, 'No se que paso')
        }
      } else {
        return { finalizado: false, mensaje: 'Fallo segip'}
      }
    } catch(error) {
      this.logger.error('Error fetching data segip: ', error.message)
      return this.assembleAnswer(false, 'Failed to fetch data from SEGIP service')
    }
  }

  private processResponse(response) {
    const incorrectData: string[] = []
    if(response?.NumeroDocumento === DataStatesEnum.NO_CORRESPONDE) {
      incorrectData.push('Nümero de documento')
    }
    if (response?.Complemento === DataStatesEnum.NO_CORRESPONDE) {
      incorrectData.push('Complemento')
    }
    if (response?.Nombres === DataStatesEnum.NO_CORRESPONDE) {
      incorrectData.push('Nombre(s)')
    }
    if (response?.PrimerApellido === DataStatesEnum.NO_CORRESPONDE) {
      incorrectData.push('Primer Apellido')
    }
    if (response?.SegundoApellido === DataStatesEnum.NO_CORRESPONDE) {
      incorrectData.push('Segundo Apellido')
    }
    if (response?.FechaNacimiento === DataStatesEnum.NO_CORRESPONDE) {
      incorrectData.push('Fecha de Nacimiento')
    }
    if (incorrectData.length > 0) {
      return incorrectData
    } else {
      return []
    }
  }

  private assembleAnswer(success, message) {
    return {
      finalizado: success,
      mensaje: `Segip: ${message}`,
    }
  }

  private assemblePersonData(personData) {
    const dateString = personData.fechaNacimiento //"23/01/1984"; // Oct 23
    const newData = dateString.replace(/(\d+[/])(\d+[/])/, '$2$1')
    const newDate = new Date(newData)

    const fieldData = {
      Complemento: personData.complemento,
      NumeroDocumento: personData.ci,
      Nombres: personData.nombres,
      PrimerApellido: personData.paterno || '--',
      SegundoApellido: personData.materno || '--',
      FechaNacimiento: dayjs(newDate).format('DD/MM/YYYY'),
    }
    return fieldData
  }

  private assembleQueryParams(data) {
    return Object.keys(data)
    .map((dato) => `"${dato}":"${data[dato]}"`)
    .join(', ')
  }
}