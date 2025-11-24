import { DepartmentReportService } from "@high-demand/domain/ports/outbound/department-report.service";
import { Injectable } from "@nestjs/common";
import { Response } from "express";
import * as PDFDocument from 'pdfkit';

@Injectable()
export class DepartmentReportImpl implements DepartmentReportService {

  async generateDepartmentReport(formData: any, res: Response) {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        layout: 'landscape'
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=reporte-departamento.pdf');
      doc.pipe(res);
      doc.strokeColor('#0d9488');

      // Configuración de páginas
      const PAGE_HEIGHT = 595; // Altura de A4 en landscape
      const BOTTOM_MARGIN = 100; // Espacio para el footer
      const SPACE_BETWEEN_TABLES = 5;

      let currentY = 50;

      // Generar header solo en la primera página
      this.generateHeader(doc, 0, currentY, 40, 35);
      currentY += 40;
      this.generateDistrictInfo(doc, currentY, formData);
      currentY += 42;

      for (let d = 0; d < formData.districts.length; d++) {
        const districtName = formData.districts[d].districtName
        currentY = currentY + 12
        const pageWidth = 740;
        const tableWidth = 640;
        const startX = (pageWidth - tableWidth) / 2;
        doc.font('./fonts/Montserrat-Bold.ttf')
          .fontSize(9)
          .text(`Distrito Educativo: ${districtName}`, startX, currentY - 12);
        for (let i = 0; i < formData.districts[d].institutions.length; i++) {
          const tableData = formData.districts[d].institutions[i];

          // Calcular altura EXACTA de esta tabla específica
          const tableHeight = this.calculateTableHeight(formData.districts[d].institutions.length);

          // Verificar si la tabla cabe en la página actual
          if (currentY + tableHeight >= PAGE_HEIGHT - BOTTOM_MARGIN) {
            doc.addPage();
            doc.strokeColor('#0d9488');
            currentY = 50;

            this.generateSecondaryHeader(doc, currentY);
            currentY += 30;
          }


          // Generar la tabla con el número específico de filas
          currentY = this.generateTable(doc, currentY, i + 1, tableData);

          // Agregar espacio entre tablas (excepto después de la última)
          if (i < formData.districts[d].institutions[i].length - 1) {
            currentY += SPACE_BETWEEN_TABLES;
          }
        }

      }

      this.generateFooter(doc, currentY);

      doc.end();
      doc.on('error', (err) => {
        console.error('Error durante el envio', err);
      });

    } catch(error) {
      console.error('Error durante la generación del PDF:', error);
      if(!res.headersSent) {
        res.status(500).json({
          status: 'error',
          message: error.message
        });
      }
    }
  }

  private calculateTableHeight(numberOfRows: number): number {
    const ROW_HEIGHT = 20;
    // 1 fila de headers + 1 fila de subheaders + N filas de datos
    return (1 + 1 + numberOfRows) * ROW_HEIGHT;
  }

  private generateSecondaryHeader(doc: PDFKit.PDFDocument, y: number) {
    doc.fontSize(10)
      .font('./fonts/Montserrat-Bold.ttf')
      .text('REPORTE DE REGISTRO Y VALIDACIÓN DISTRITAL DE', 0, y, { align: 'center' })
      .moveDown(0.2)
      .text('UNIDADES EDUCATIVAS DE ALTA DEMANDA - Continuación', { align: 'center' })
      .moveDown(0.5);

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(10)
      .text('Gestión 2026', { align: 'center'});
  }

  private generateHeader(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    imgX: number,
    imgY: number
  ) {
    const imagePath = './fonts/logo.png';
    const imageWidth = 55;
    const imageHeight = 55;
    const imageX = imgX;
    const imageY = imgY;

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight
    });

    doc.fontSize(10)
      .font('./fonts/Montserrat-Bold.ttf')
      .text('REPORTE DE REGISTRO Y VALIDACIÓN DEPARTAMENTAL DE', x, y, { align: 'center' })
      .moveDown(0.2)
      .text('UNIDADES EDUCATIVAS DE ALTA DEMANDA', { align: 'center' })
      .moveDown(0.5);

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(10)
      .text('Gestión 2026', { align: 'center'});
  }

  private generateDistrictInfo(doc: PDFKit.PDFDocument, y: number, data: any) {
    const startX = 50;
    const rowHeight = 15;

    doc.font('./fonts/Montserrat-Bold.ttf')
      .fontSize(9)
      .text(`Departamento: ${data?.department}`, startX, y + rowHeight);

  }

  private drawTable(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    headers: string[],
    rows: any[],
    columnWidths: number[],
    subHeaders: string[],
    columnWidthsSubHeaders: number[],
    rowHeight: number = 20,
    headerBackground: boolean = true
  ): number {
    doc.lineWidth(0.5);

    // Dibujar headers
    headers.forEach((header, i) => {
      const xPos = x + columnWidths.slice(0, i).reduce((sum, width) => sum + width, 0);
      const width = columnWidths[i];

      if (headerBackground) {
        doc.fillColor('#e0f2f1')
           .rect(xPos, y, width, rowHeight)
           .fill()
           .fillColor('#000000');
      }

      doc.rect(xPos, y, width, rowHeight).stroke();
      doc.font('./fonts/Montserrat-Bold.ttf')
         .fontSize(7)
         .text(header, xPos + 4, y + 6, {
           width: width - 4,
         });
    });

    // Dibujar subheaders
    subHeaders.forEach((subHeader, i) => {
      const xPos = x + columnWidthsSubHeaders.slice(0, i).reduce((sum, width) => sum + width, 0);
      const width = columnWidthsSubHeaders[i];

      if(headerBackground) {
        doc.fillColor('#e0f2f1')
          .rect(xPos, y + 20, width, rowHeight)
          .fill()
          .fillColor('#000000')
      }
      doc.rect(xPos, y + 20, width, rowHeight).stroke();
      doc.font('./fonts/Montserrat-Bold.ttf')
        .fontSize(7)
        .text(subHeader, xPos + 4, y + 22, {
          width: width - 4,
          align: 'center'
        })
    })

    // Dibujar filas de datos - MODIFICADO PARA OBJETOS
    let newY = y + 20;
    rows.forEach((row, rowIndex) => {
      const yPos = newY + (rowIndex + 1) * rowHeight;

      // Mapear el objeto a un array según el orden de subHeaders
      const cellValues = this.mapObjectToCells(row, subHeaders, rowIndex);

      cellValues.forEach((cell, i) => {
        const xPos = x + columnWidthsSubHeaders.slice(0, i).reduce((sum, width) => sum + width, 0);
        const width = columnWidthsSubHeaders[i];

        doc.rect(xPos, yPos, width, rowHeight).stroke();
        doc.font('./fonts/Lato-Regular.ttf')
           .fontSize(7)
           .text(cell || '', xPos + 4, yPos + 6, {
             width: width - 4,
             align: i >= 4 ? 'center' : 'left'
           });
      });
    });

    doc.lineWidth(1);
    const totalTableHeight = (1 + 1 + rows.length) * rowHeight;
    return y + totalTableHeight;
  }

  private mapObjectToCells(row: any, subHeaders: string[], rowIndex: number): string[] {
    const propertyMap: {[key: string]: string} = {
      'Nivel de educación': 'nivel',
      'Año de escolaridad': 'grade',
      'Paralelo': 'parallel',
      'N° de plazas disponibles': 'totalQuota',
      'Turno': 'shift',
      'Observación': 'observation'
    };

    return subHeaders.map(header => {
      if (header === 'N°') {
        return (rowIndex + 1).toString();
      }

      const propertyName = propertyMap[header];
      return row[propertyName] || '';
    });
  }

  private generateTable(doc: PDFKit.PDFDocument, y: number, tableNumber: number = 1, data: any) {

    const pageWidth = 740;
    const tableWidth = 640;
    const startX = (pageWidth - tableWidth) / 2;

    const columnWidths = [300, 140, 300];
    const columnWidthSubHeaders = [210, 30, 60, 100, 40, 80, 220];

    const headers = [
      `Unidad Educativa: ${data.name}`,
      `Código RUE: ${data.rude}`,
      `Dependencia: ${data.dependency}`,
    ];
    const subHeaders = [
      'Nivel de educación',
      'N°',
      'Turno',
      'Año de escolaridad',
      'Paralelo',
      'N° de plazas disponibles',
      'Observación'
    ]

    return this.drawTable(doc, startX, y, headers, data.courses, columnWidths, subHeaders, columnWidthSubHeaders);
  }

  private generateFooter(doc: PDFKit.PDFDocument, y: number) {
    const startX = 50;
    const pageWidth = 740;
    const centerX = pageWidth / 2;

    // Sellos y firmas
    doc.font('./fonts/Montserrat-Bold.ttf')
      .fontSize(8)
      .text('Sello de la DDE', startX + 170, y + 65);

    doc.text('Sello y firma del Director(a) de', centerX - 80, y + 65, { align: 'center' })
      .moveDown(0.2)
      .text('Distrital Educativa', { align: 'center'})

    // Fecha y hora
    const now = new Date();
    const fechaHora = now.toLocaleString('es-BO');

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(8)
      .text(`Fecha y hora de impresión: ${fechaHora}`, startX, y + 80);

    // // Texto final
    doc.font('./fonts/Lato-Italic.ttf')
      .fontSize(7)
      .text('Esta documentación constituye una declaración jurada', startX - 585, y + 86, { align: 'center' });
  }

}