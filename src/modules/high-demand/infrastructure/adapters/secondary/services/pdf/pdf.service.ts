import { PdfService } from "@high-demand/domain/ports/outbound/pdf.service";
import { Injectable } from "@nestjs/common";
import { Response } from "express";
import * as PDFDocument from 'pdfkit';



@Injectable()
export class PdfServiceImpl implements PdfService {

  async generateAffidavit(formData: any, res: Response) {
    try {
      const doc = new PDFDocument({ margin: 1})
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline; filename=declaracion.pdf')
      doc.pipe(res);
      doc.strokeColor('#0D9488')
      this.generateHeader(doc, 0, 50, 40, 35)
      let currentY = 120;
      currentY = this.generateSchoolData(doc, formData, currentY)
      currentY = this.generateRequirement(doc, formData, currentY + 10);
      currentY = this.generateRequestStatus(doc, formData, currentY + 10);
      this.generateSignaturesAndSeals(doc, currentY + 10)
      doc.end()
      doc.on('error', (err) => {
        console.error('Error durante el envío del PDF: ', err)
      })
    } catch(error) {
      console.error('Error durante el envío del PDF: ', error)
      if(!res.headersSent) {
        res.status(500).json({ status: 'error', message: error.message })
      }
    }
  }

  private generateHeader(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    imgX: number,
    imgY: number,
  ) {
    const imagePath = './fonts/logo.jpg'
    const imageWidth = 65;
    const imageHeight = 65;

    const imageX = imgX;
    const imageY = imgY;

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight
    })

    doc.fontSize(9)
      .font('./fonts/Montserrat-Bold.ttf')
      .text('FORMULARIO DE REGISTRO Y VALIDACIÓN DE', x, y, { align: 'center'})
      .moveDown(0.2)
      .text('UNIDAD EDUCATIVA DE ALTA DEMANDA', { align: 'center'})
      .moveDown(0.5)

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(9)
      .text('Gestión 2026', { align: 'center'})
  }

  private generateSchoolData(doc: PDFKit.PDFDocument, data: any, startY: number) {
    const { educationalInstitution } = data
    this.generateSectionTitle(doc, 'I. DATOS DE LA UNIDAD EDUCATIVA', startY)
    let y = startY + 15;
    const fields = [
      ['Departamento:', educationalInstitution?.jurisdiction?.localityPlaceType?.parent?.parent?.parent?.parent?.place],
      ['Distrito Educativo:', educationalInstitution?.jurisdiction?.districtPlaceType?.place],
      ['Unidad Educativa:', educationalInstitution?.name],
      ['Código RUE:', educationalInstitution?.id],
      ['Dependencia:', educationalInstitution?.dependencyType?.dependency],
    ]
    fields.forEach(([label, value]) => {
      this.generateField(doc, label, value, 60, 150, y)
      y += 15;
    })
    return y;
  }

  private generateRequirement(doc: PDFKit.PDFDocument, data: any, startY: number) {
    const { courses } = data
    this.generateSectionTitle(doc, 'II. REQUERIMIENTO', startY);
    const yStart = startY + 20

    const startX = 60;
    const colWidth = 160;
    const rowHeight = 70;
    const maxColsPerRow = 3;

    courses.forEach((course, i) => {
      // Calcula fila y columna
      const colIndex = i % maxColsPerRow;
      const rowIndex = Math.floor(i / maxColsPerRow);

      const x = startX + colIndex * colWidth;
      const y = yStart + rowIndex * rowHeight;

      // Título
      doc.font('./fonts/Lato-Bold.ttf')
        .fontSize(8)
        .text(course?.level?.name, x, y, { width: colWidth });

      // Subcampos
      const subY = y + 15;
      [`Turno:`, `Año de escolaridad: ${course?.grade?.name}`, `Paralelo: ${course?.parallel?.name}`, `N° de plazas disponibles: ${course?.totalQuota}`].forEach(
        (label, index) => {
          doc.font('./fonts/Lato-Regular.ttf')
            .fontSize(8)
            .text(label, x, subY + index * 12);
        }
      );
    });
    const totalRows = Math.ceil(courses.length / maxColsPerRow)
    const finalY = yStart + totalRows * rowHeight
    return finalY;
  }

  private generateRequestStatus(doc: PDFKit.PDFDocument, data:any, startY: number) {
    this.generateSectionTitle(doc, 'III. ESTADO DE SOLICITUD', startY)
    const y = startY + 20
    // const yText = 323
    doc.font('./fonts/Lato-Bold.ttf')
      .fontSize(8)
      .text('¿Existen observaciones?', 0, y, { align: 'center'})

    const centerX = doc.page.width / 2;
    const siBoxX = centerX - 60;
    const noBoxX = centerX + 10;
    const boxY = y + 15;
    const boxSizeW = 40;
    const boxSizeH = 15;

    doc.rect(siBoxX, boxY, boxSizeW, boxSizeH).stroke();
    doc.rect(noBoxX, boxY, boxSizeW, boxSizeH).stroke();

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(8)
      .text('SI', siBoxX + 15, boxY + 3)
      .text('NO', noBoxX + 15, boxY + 3);

    doc.font('./fonts/Lato-Bold.ttf')
      .text('Descripción de observaciones: ', 60, boxY + 30);

    doc.rect(60, boxY + 45, 480, 50).stroke();
    return boxY + 110;
  }

  private async generateSignaturesAndSeals(doc: PDFKit.PDFDocument, startY: number) {
    const ySign = startY + 10
    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(8)
      .text('Sello de la UE', 60, ySign+ 20)
      .text('Sello de la DDE', 300, ySign+20)
      .text('Sello y firma del Director(a) de', 150, ySign + 60)
      .moveDown(0.2)
      .text('Unidad Educativa', 170)
      .text('Sello y firma del Director(a) de Distrital', 370, ySign + 60)
      .moveDown(0.2)
      .text('Educativa', 420)

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(7)
      .font('./fonts/Lato-Italic.ttf')
      .text(`Fecha y hora de impresión:  ${this.formatDate()}`, 60, ySign + 120)
      .text('Esta documentación constituye una declaracion jurada', 60, ySign + 130)
  }

  private generateSectionTitle(doc: PDFKit.PDFDocument, title: string, y: number) {
    const x = 50;
    const width = 500;
    const height = 15;

    doc.rect(x, y-2, width, height)
      .fill('#CCF2EE')

    doc.font('./fonts/Montserrat-Bold.ttf')
      .fontSize(7)
      .fillColor('#000000')
      .text(title, x+5, y)
  }

  private generateField(
    doc: PDFKit.PDFDocument,
    label: string,
    value: string,
    xLabel: number,
    xValue: number,
    y: number,
    width: number = 120,
    height: number = 10
  ) {
    doc.font('./fonts/Lato-Bold.ttf')
      .fontSize(8)
      .fillColor('#000000')
      .text(label, xLabel, y)

    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(8)
      .fillColor('#000000')
      .text(value || '', xValue + 7, y)
  }

  private formatDate(): string {
    const date = new Date()
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${day} de ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
  }

}