import { Injectable } from "@nestjs/common";
import { ReportConsolidationService } from "@pre-registration/domain/ports/outbound/report-consolidation.service";
import * as ExcelJS from 'exceljs';


@Injectable()
export class ReportConsolidateServiceImpl implements ReportConsolidationService {

  async consolidateReports(
    data: Array<any>
  ): Promise<any> {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte sorteados y hermanos');
      worksheet.columns = [
        { header: 'Código', key: 'codigo', width: 15 },
        { header: 'Carnet Identidad', key: 'carnet_identidad', width: 15 },
        { header: 'Paterno', key: 'paterno', width: 30 },
        { header: 'Materno', key: 'materno', width: 30 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Estado', key: 'estado', width: 15 },
        { header: 'Nivel', key: 'nivel', width: 40 },
        { header: 'Grado', key: 'grado', width: 20 },
        { header: 'Paralelo', key: 'paralelo', width: 10 },
      ];

      worksheet.addRows(data);

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);

    } catch(error) {
      console.error('Erro al generar el excel')
    }
  }
}