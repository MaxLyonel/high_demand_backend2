import { Injectable } from "@nestjs/common";
import { PdfService } from "@pre-registration/domain/ports/outbound/pdf.service";
import { Response } from "express";
import * as PDFDocument from 'pdfkit'
import * as QRCode from 'qrcode'




@Injectable()
export class PdfServiceImpl implements PdfService {

  async generateRegistrationForm(formData: any, res: Response): Promise<void> {
    const doc = new PDFDocument({ margin: 1 })
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename=alta.pdf')
    doc.pipe(res);
    doc.strokeColor('#0D9488');
    await this.generateHeader(doc, 0, 50, 40, 35, 520, 35)
    this.generateSchoolData(doc, formData);
    this.generateParentData(doc, formData);
    this.generateStudentData(doc, formData);
    this.generateAddressData(doc, formData);
    this.generateSiblingsData(doc, formData);
    this.generateRegistrationData(doc, formData);
    this.drawDashedLine(doc, 50, 510, 562, 510, { color: '#0D9488'})
    await this.generateHeader(doc, 0, 545, 40, 530, 520, 530)
    this.generateSummaryData(doc, formData);
    doc.end()
  }

  private async generateHeader(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    imgX: number,
    imgY: number,
    xQr: number,
    yQr: number
  ) {
    // Encabezado
    const imagePath = './fonts/logo.jpg'
    const imageWidth = 65;
    const imageHeight = 65;
    const imageX = imgX;
    const imageY = imgY;

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight
    })

    doc.fontSize(6)
       .font('./fonts/Montserrat-Bold.ttf')
       .text('FORMULARIO DE PRE INSCRIPCIÓN PARA EL SORTEO DE PLAZAS EN UNIDADES EDUCATIVAS DE ALTA DEMANDA PARA EDUCACIÓN', x, y, { align: 'center' })
       .moveDown(0.2)
       .text('INICIAL Y PRIMER AÑO DE ESCOLARIDAD DE EDUCACIÓN PRIMARIA Y SECUNDARIA', { align: 'center' })
       .moveDown(0.5);

    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(5)
       .text('LA INFORMACIÓN RECABADA SERÁ UTILIZADA PARA EL REGISTRO DE PRE INSCRIPCIÓN (POSTULACIÓN) DE LA O EL', { align: 'center' })
       .text('ESTUDIANTE PARA LA GESTIÓN 2025', { align: 'center' })
       .moveDown(0.3)
       .moveDown(1);
    const qrCodeDataURL = await this.generateQRCode(`FORM-${Date.now()}`)
    await this.addQRCodeTOPDF(doc, qrCodeDataURL, xQr, yQr)
  }

  private generateSchoolData(doc: PDFKit.PDFDocument, data:any) {
    const { institution } = data
    this.generateSectionTitle(doc, 'I. DATOS DE LA UNIDAD EDUCATIVA A LA QUE POSTULA', 100);
    this.generateField(doc, 'NOMBRE DE LA UNIDAD EDUCATIVA:', `${institution?.id} - ${institution?.name}` || '81480018 - JOSE ALONSO DE IBAÑEZ A', 55, 180, 112, 380);
    this.generateField(doc, 'TURNO DE LA UNIDAD EDUCATIVA:', institution.shift || 'MAÑANA', 55, 180, 124);
    this.generateField(doc, 'DEPENDENCIA DE LA UNIDAD EDUCATIVA:', institution?.dependency || 'FISCAL', 305, 430, 124, 130);
    this.generateField(doc, 'DEPARTAMENTO:', institution?.department || 'CHUQUISACA', 55, 120, 136, 50);
    this.generateField(doc, 'DISTRITO:', institution?.district || 'POTOSÍ', 180, 220, 136, 120);
    this.generateField(doc, 'ZONA/BARRIO/VILLA:', institution?.area || 'BOLIVAR Nro 997', 350, 415, 136, 145);
  }

  private generateParentData(doc: PDFKit.PDFDocument, data: any) {
    const { representative, registration } = data
    this.generateSectionTitle(doc, 'II. DATOS DEL PADRE, MADRE O TUTOR(a) DE LA O EL ESTUDIANTE', 150);
    this.drawTable(doc, 50, 160, 250, 80);
    this.generateField(doc, 'Apellido Paterno:', representative?.lastName || 'VARGAS', 55, 175, 166);
    this.generateField(doc, 'Apellido Materno:', representative?.mothersLastName || 'RAMIREZ', 55, 175, 178);
    this.generateField(doc, 'Nombre(s):', representative?.name || 'LEONEL MAXIMO', 55, 175, 190);
    this.generateField(doc, 'Cédula de Identidad:', representative?.identityCard || '9101918', 55, 175, 202);
    this.generateField(doc, 'Dirección de su residencia:', data.parentAddress || 'VILLA EL CARMEN, PEDRO PADILLA, CALLE 4', 55, 175, 214);
    this.generateField(doc, 'En caso de tutor(s) ¿Cuál es el parentesco?:', registration?.criteria?.name  || 'PADRE', 55, 175, 226);

    // Dirección actual del trabajo del padre, madre y/o tutor
    this.generateSectionSubTitle(doc, 'DIRECCIÓN ACTUAL DEL PADRE, MADRE Y/O TUTOR', 310, 150)
    this.generateField(doc, 'Nombre del lugar de trabajo:', 'TIENDA DE EQUIPOS DE COMPUTACIÓN', 310, 400, 166, 160)
    this.generateField(doc, 'Municipio:', 'POTOSÍ', 310, 400, 178, 160)
    this.generateField(doc, 'Zona / Villa:', 'ZONA CENTRAL', 310, 400, 190, 160)
    this.generateField(doc, 'Avenida / Calle / N°:', 'CALLE FRIAS / N° 18', 310, 400, 202, 160)
    this.generateField(doc, 'Teléfono / Celular:', '60469641', 310, 400, 214, 160)
    // Texto
    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(5)
       .fillColor('#000000')
       .text('DIBUJE EL CROQUIS DE UBICACIÓN DEL TRABAJO ACTUAL DEL PADRE,', 350, 226)
       .text('MADRE Y/O TUTOR EN EL REVERSO DE LA HOJA', 380, 231)
  }

  private generateStudentData(doc: PDFKit.PDFDocument, data: any) {
    const { postulant } = data
    this.generateSectionTitle(doc, 'III. DATOS DE LA O EL ESTUDIANTE', 245)
    this.generateField(doc, 'Apellido Paterno:', postulant?.lastName, 55, 175, 260)
    this.generateField(doc, 'Apellido Materno:', postulant?.mothersLastName, 55, 175, 272)
    this.generateField(doc, 'Nombre(s):', postulant?.name, 55, 175, 284)
    this.generateField(doc, 'Fecha de nacimiento (Día / Mes / Año):', postulant?.birthDate, 55, 175, 296)
    this.generateField(doc, 'Lugar de nacimiento:', postulant?.placeBirth, 55, 175, 308)
    // carnet identidad
    this.generateField(doc, 'N° de la cédulca de identidad si tiene:', postulant?.identityCard , 310, 420, 260, 140)
    this.generateField(doc, 'Género:', '', 310, 420, 272, 10)
    doc.text('Másculino', 435, 272)
    this.generateField(doc, '', 'X', 510, 480, 272, 10)
    doc.text('Femenino', 495, 272)
    this.generateField(doc, 'Edad:', postulant?.age, 310, 420, 284, 20)
    doc.text('Año', 445, 284)
    this.generateField(doc, '', postulant?.months, 310, 480, 284, 20)
    doc.text('Mes', 505 , 284)
  }

  private generateAddressData(doc: PDFKit.PDFDocument, data: any) {
    this.generateSectionTitle(doc, 'IV. DIRECCIÓN ACTUAL DE RESIDENCIA DE LA O EL ESTUDIANTE', 325)
    this.generateField(doc, 'Municipio:', 'POTOSÍ', 55, 175, 340)
    this.generateField(doc, 'Zona / Villa:', 'ZONA CENTRAL', 55, 175, 352)
    this.generateField(doc, 'Avenida / Calle / N°:', 'MEDINACELLI', 55, 175, 364)
    this.generateField(doc, 'Teléfono / Celular:', '67612212', 55, 175, 376)

    // texto
    doc.fontSize(5)
      .fillColor('#000000')
      .text('DIBUJE EL CROQUIS DE LA DIRECCIÓN DE LA RESIDENCIA', 360, 352)
      .text('DEL ESTUDIANTE EN EL REVERSO DE LA HOJA', 370, 358)
  }

  private generateSiblingsData(doc: PDFKit.PDFDocument, data: any) {
    this.generateSectionTitle(doc, 'V. HERMANA(S) O HERMANO(S) EN ETAPA DE ESCOLARIDAD EN LA UNIDAD EDUCATIVA A LA QUE POSTULA EN LA PRESENTE GESTIÓN', 390)
    const headers = ['Código rude', 'Nivel de educación', 'Año de escolaridad']
    const rows = [
      ['123223122', 'Primaria Comunitaria Vocacional', 'Tercero'],
      ['817212120', 'Secundaria Comunitaria Productiva', 'Quinto']
    ]
    this.drawTable2(doc, 50, 402, headers, rows);
  }

  private generateRegistrationData(doc: PDFKit.PDFDocument, data: any) {
    this.generateSectionTitle(doc, 'VI. DATOS DE PREINSCRIPCIÓN (POSTULANTES) EN LA GESTIÓN 2025', 440)
    this.generateField(doc, 'Educación Secundaria Comunitaria Productiva:', 'X', 55, 185, 455, 10)
    this.generateField(doc, 'Primer año de escolaridad:', 'X', 220, 295, 455, 10)
    this.generateField(doc, 'Justificativo', 'X', 55, 100, 470, 10)
    doc.text('Hermanos', 115, 470)
    this.generateField(doc, '', '', 125, 170, 470, 10)
    doc.text('Vivienda', 185, 470)
    this.generateField(doc, '', '', 205, 230, 470, 10)
    doc.text('Lugar de trabajo', 245, 470)
    this.generateField(doc, 'Lugar y Fecha:', 'POTOSÍ, 11 DE NOVIEMBRE DE 2025', 55, 100, 485, 205)
    // firmas
    this.drawSolidLine(doc, 325, 485, 425, 485)
    doc.fontSize(5).fillColor('#000000').text('Firma del padre/madre o tutor(a)', 335, 486)

    this.drawSolidLine(doc, 455, 485, 555, 485)
    doc.fontSize(5).fillColor('#000000').text('Sello y firma del Director(a) y/o Responsable', 457, 486)
    doc.fontSize(5).fillColor('#000000').text('de la Unidad Educativa', 480, 490)
  }

  private generateSummaryData(doc: PDFKit.PDFDocument, data:any) {
    const { institution, registration, postulant } = data
    // Datos de la unidad educativa
    this.generateSectionSubTitle(doc, 'DATOS DE LA UNIDAD EDUCATIVA A LA QUE POSTULA', 50, 590)
    this.generateField(doc, 'NOMBRE DE LA UNIDAD EDUCATIVA:', `${institution?.id} - ${institution?.name}` , 50, 160, 605, 180)
    this.generateField(doc, 'TURNO DE LA UNIDAD EDUCATIVA:', 'MAÑANA', 50, 160, 620, 180)
    this.generateField(doc, 'DEPARTAMENTO:', institution?.department, 50, 160, 635, 180)
    this.generateField(doc, 'DISTRITO:', institution?.district, 50, 160, 650, 180)
    this.generateField(doc, 'ZONA / BARRIO / VILLA', institution?.area, 50, 160, 665, 180)
    this.generateField(doc, 'Nivel y año de escolaridad al que postula', `${registration?.course?.level} - ${registration?.course.grade}`, 50, 160, 680, 180)
    this.generateField(doc, 'Lugar y Fecha:', 'POTOSÍ, 11 DE NOVIEMBRE DE 2025', 50, 160, 695, 180)
    // Datos del estudiante
    this.generateSectionSubTitle(doc, 'DATOS DEL ESTUDIANTE', 350, 590)
    this.generateField(doc, 'Apellido Paterno:', postulant?.lastName, 350, 405, 605, 155)
    this.generateField(doc, 'Apellido Materno:', postulant?.mothersLastName, 350, 405, 620, 155)
    this.generateField(doc, 'Nombre(s):', postulant?.name, 350, 405, 635, 155)
    this.generateField(doc, 'Cedula de Identidad:', postulant?.identityCard, 350, 405, 650, 155)
    this.generateField(doc, 'Domicilio:', 'VILLA EL CARMEN, PEDRO PADILLA', 350, 405, 665, 155)
    // firmas
    this.drawSolidLine(doc, 355, 695, 445, 695)
    doc.fontSize(5).fillColor('#000000').text('Firma del padre/madre o tutor(a)', 365, 698)

    this.drawSolidLine(doc, 465, 695, 555, 695)
    doc.fontSize(5).fillColor('#000000').text('Sello y firma del Director(a) y/o Responsable', 463, 698)
    doc.fontSize(5).fillColor('#000000').text('de la Unidad Educativa', 480, 703)
  }

  // Helpers
  private async generateQRCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: 30,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch(error) {
      console.error('Error generado QR: ', error)
      throw error
    }
  }

  private async addQRCodeTOPDF(doc: any, qrCodeDataURL: string, x: number, y: number): Promise<void> {
    try {
      const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/,'')
      const qrBuffer = Buffer.from(base64Data, 'base64')
      doc.image(qrBuffer, x, y, {
        width: 20,
        height: 20,
        fit: [43, 43]
      })

      doc.fontSize(8).fillColor('red')
      .text('N° 0331821', x - 20, y + 45, { width: 80, align: 'center' });
    } catch(error) {
      console.error('Error añadiendo QR al PDF:', error)
    }
  }

  private generateSectionTitle(doc: PDFKit.PDFDocument, title: string, y: number) {
    doc.font('./fonts/Montserrat-Bold.ttf')
       .fontSize(7)
       .fillColor('#000000')
       .text(title, 50, y);
  }

  private generateSectionSubTitle(doc: PDFKit.PDFDocument, title: string, x: number, y: number) {
    doc.font('./fonts/Montserrat-Bold.ttf').fontSize(7).fillColor('#000000').text(title, x, y)
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
    // Texto de la etiqueta
    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(6)
       .fillColor('#000000')
       .text(label, xLabel, y);
    // 🔹 Dibujar cuadro para el valor
    doc.lineWidth(0.5) // grosor fino
       .rect(xValue, y - 2, width, height) // rectángulo alrededor
       .stroke();
    // 🔹 Escribir el valor dentro del cuadro con padding
    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(6)
       .fillColor('#000000')
       .text(value || '', xValue + 3, y, { width: width - 6, height });
  }

  private drawTable(doc: PDFKit.PDFDocument, x: number, y: number, width: number, height: number, options?: { header?: string }) {
    doc.lineWidth(0.5)
    if (options?.header) {
      doc.rect(x, y, width, 20).fill('#f0f0f0').stroke();
      doc.fillColor('#000').font('./fonts/Montserrat-Bold.ttf').text(options.header, x + 5, y + 5);
      y += 20;
      height -= 20;
    }
    doc.rect(x, y, width, height).stroke();
    doc.lineWidth(1)
  }

  private drawTable2(doc: PDFKit.PDFDocument, x: number, y: number, headers: string[], rows: string[][]) {
    const rowHeight = 10;
    const colWidth = 170;

    doc.lineWidth(0.5)
    headers.forEach((header, i) => {
      const xPos = x + i * colWidth;
      doc.rect(xPos, y, colWidth, rowHeight).stroke();  // Celda
      doc.font('./fonts/Lato-Bold.ttf').fontSize(6).text(header, xPos + 5, y + 1);
    });

    rows.forEach((row, rowIndex) => {
      const yPos = y + (rowIndex + 1) * rowHeight;
      row.forEach((cell, i) => {
        const xPos = x + i * colWidth;
        doc.rect(xPos, yPos, colWidth, rowHeight).stroke();  // Celda
        doc.font('./fonts/Lato-Regular.ttf').fontSize(6).text(cell, xPos + 5, yPos + 2);
      });
    });
    doc.lineWidth(1)
  }

  // Línea continua
  private drawSolidLine(
    doc: PDFKit.PDFDocument,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: { color?: string; width?: number }
  ) {
    doc.moveTo(x1, y1)
      .lineTo(x2, y2);

    if (options?.width) doc.lineWidth(options.width);
    if (options?.color) doc.strokeColor(options.color);

    doc.stroke();
  }

  // Línea segmentada
  private drawDashedLine(
    doc: PDFKit.PDFDocument,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: { color?: string; width?: number; dash?: number; space?: number }
  ) {
    doc.moveTo(x1, y1)
      .lineTo(x2, y2);

    if (options?.width) doc.lineWidth(options.width);
    if (options?.color) doc.strokeColor(options.color);

    // dash → largo del segmento, space → espacio entre segmentos
    doc.dash(options?.dash || 4, { space: options?.space || 2 })
      .stroke()
      .undash(); // 🔹 reset para no afectar lo siguiente
  }
}