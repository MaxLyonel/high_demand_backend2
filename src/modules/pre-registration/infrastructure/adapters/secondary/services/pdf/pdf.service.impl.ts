import { Injectable } from "@nestjs/common";
import { PdfService } from "@pre-registration/domain/ports/outbound/pdf.service";
import { Response } from "express";
import * as PDFDocument from 'pdfkit'
import * as QRCode from 'qrcode'




@Injectable()
export class PdfServiceImpl implements PdfService {

  async generateRegistrationForm(formData: any, res: Response): Promise<void> {
    try {
      const doc = new PDFDocument({ margin: 1 })
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline; filename=alta.pdf')
      doc.pipe(res);
      doc.strokeColor('#0D9488');
      await this.generateHeader(doc, formData, 0, 50, 40, 35, 520, 35)
      this.generateSchoolData(doc, formData);
      this.generateParentData(doc, formData);
      this.generateRegistrationData(doc, formData);
      this.generateSiblingsData(doc, formData);
      this.generateAddressData(doc, formData);
      this.generateWorkAddressTutor(doc, formData);
      this.drawDashedLine(doc, 50, 530, 562, 530, { color: '#0D9488'})
      await this.generateHeader(doc, formData, 0, 555, 40, 540, 530, 540)
      this.generateSummaryData(doc, formData);
      doc.end()
      doc.on('error', (err) => {
        console.error('Error durante el envío del PDF: ', err)
      })
    } catch(error) {
      console.error('Error antes de enviar PDF: ', error)
      if(!res.headersSent) {
        res.status(500).json({ status: 'error', message: error.message })
      }
    }
  }

  private async generateHeader(
    doc: PDFKit.PDFDocument,
    data: any,
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
       .text('FORMULARIO DE PRE INSCRIPCIÓN PARA EL SORTEO DE PLAZAS EN UNIDADES EDUCATIVAS DE ALTA DEMANDA', x, y, { align: 'center' })
       .moveDown(0.2)
       .text('SUBSISTEMA DE EDUCACIÓN REGULAR', { align: 'center' })
       .moveDown(0.5);

    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(5)
       .text('La información recabada será utilizada para el registro de pre inscripción (postulación) de la o el estudiante para la gestión 2026', { align: 'center' })
       .moveDown(1)
       .font('./fonts/Lato-Bold.ttf')
       .text(`Fecha del sorteo: ${data.dateLotteryIni ? this.getDay(data.dateLotteryIni) : ''} y ${ data.dateLotteryEnd ? this.getDay(data.dateLotteryEnd) : ''} de noviembre de 2025`, { align: 'center' })
       .moveDown(1);
    const qrCodeDataURL = await this.generateQRCode(`FORM-${Date.now()}`)
    await this.addQRCodeTOPDF(doc, data, qrCodeDataURL, xQr, yQr)
  }

  private generateSchoolData(doc: PDFKit.PDFDocument, data:any) {
    const { institution } = data
    this.generateSectionTitle(doc, 'I. DATOS DE LA UNIDAD EDUCATIVA A LA QUE POSTULA', 100);
    this.generateField(doc, 'NOMBRE DE LA UNIDAD EDUCATIVA:', `${institution?.id} - ${institution?.name}`, 55, 180, 112, 380);
    this.generateField(doc, 'TURNO DE LA UNIDAD EDUCATIVA:', institution?.shift, 55, 180, 124);
    this.generateField(doc, 'DEPENDENCIA DE LA UNIDAD EDUCATIVA:', institution?.dependency, 305, 430, 124, 130);
    this.generateField(doc, 'DEPARTAMENTO:', institution?.department , 55, 120, 136, 50);
    this.generateField(doc, 'DISTRITO EDUCATIVO:', institution?.district, 180, 250, 136, 90);
    this.generateField(doc, 'ZONA/BARRIO/VILLA:', institution?.area, 350, 415, 136, 145);
  }

  private generateParentData(doc: PDFKit.PDFDocument, data: any) {
    const { representative, registration, registrationLocationWorkPlace, postulant } = data
    this.generateSectionTitle(doc, 'II. DATOS DEL PADRE, MADRE O TUTOR(a) DE LA O EL ESTUDIANTE', 150);
    this.drawTable(doc, 50, 160, 250, 80);
    this.generateField(doc, 'Apellido Paterno:', representative?.lastName, 55, 175, 166);
    this.generateField(doc, 'Apellido Materno:', representative?.mothersLastName, 55, 175, 178);
    this.generateField(doc, 'Nombre(s):', representative?.name, 55, 175, 190);
    this.generateField(doc, 'N° de cédula de identidad:', representative?.identityCard, 55, 175, 202);
    this.generateField(doc, 'Dirección actual de su residencia:', representative?.parentAddress, 55, 175, 214);
    this.generateField(doc, 'En caso de tutor(a) ¿Cuál es el parentesco?:', representative?.relation, 55, 175, 226);

    // Datos del estudiante
    this.generateSectionSubTitle(doc, 'III. DATOS DEL ESTUDIANTE', 310, 150)
    this.generateField(doc, 'Código RUDE:', postulant?.codeRude, 310, 400, 166, 160)
    this.generateField(doc, 'Apellido Paterno:', postulant?.lastName, 310, 400, 178, 160)
    this.generateField(doc, 'Apellido Materno:', postulant?.mothersLastName, 310, 400, 190, 160)
    this.generateField(doc, 'Nombre(s):', postulant?.name, 310, 400, 202, 160)
    this.generateField(doc, 'Fecha de nacimiento: (Día/Mes/Año)', this.formatDateTime(postulant.birthDate || '', true), 310, 410, 214, 150)
    this.generateField(doc, 'Lugar de nacimiento:', postulant?.placeBirth, 310, 400, 226, 160)
    this.generateField(doc, 'N° de cédula de identidad:', postulant?.identityCard, 310, 400, 238, 160)
    this.generateField(doc, 'Género: (masculino o femenino)', postulant?.gender === 'F' ? 'FEMENINO' : 'MASCULINO', 310, 400, 250, 160)
    this.generateField(doc, 'Edad: (de acuerdo a edades cronológicas)', `${postulant?.age} años y ${postulant?.months} meses`, 310, 420, 262, 140)
    // Texto
    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(5)
       .fillColor('#000000')
       .text('DIBUJE EL CROQUIS DE UBICACIÓN DEL TRABAJO DEL ESTUDIANTE,', 350, 276)
       .text('EN EL REVERSO DE LA HOJA', 380, 283)
  }

  private generateWorkAddressTutor(doc: PDFKit.PDFDocument, data: any) {
    const { registrationLocationWorkPlace } = data
    this.generateSectionTitle(doc, 'C. DIRECCIÓN ACTUAL DEL TRABAJO DEL PADRE, MADRE Y/O TUTOR', 420)
    // Dirección actual del trabajo del padre, madre y/o tutor
    this.generateField(doc, 'Nombre del lugar de trabajo:', registrationLocationWorkPlace?.nameWorkPlace, 55, 140, 432, 160)
    this.generateField(doc, 'Municipio:', registrationLocationWorkPlace?.municipality, 55, 140, 444, 160)
    this.generateField(doc, 'Zona / Villa:', registrationLocationWorkPlace?.zoneVilla, 55, 140, 456, 160)
    this.generateField(doc, 'Avenida / Calle / N°:', registrationLocationWorkPlace?.avenueStreetNro, 55, 140, 468, 160)
    this.generateField(doc, 'Teléfono / Celular:', registrationLocationWorkPlace?.telephone, 55, 140, 480, 160)
    doc.font('./fonts/Lato-Regular.ttf')
      .fontSize(5)
      .fillColor('#000000')
      .text('DIBUJE EL CROQUIS DE UBICACIÓN DEL TRABAJO ACTUAL DEL PADRE,', 100, 490)
      .text('MADRE Y/O TUTOR EN EL REVERSO DE LA HOJA', 120, 500)

    this.generateField(doc, 'Fecha y hora:', this.formatDateTime(data.createdAt || '', false), 55, 100, 512, 200)
    // firmas
    this.drawSolidLine(doc, 325, 485, 425, 485)
    doc.fontSize(5).fillColor('#000000').text('Firma del padre/madre o tutor(a)', 335, 486)

    this.drawSolidLine(doc, 455, 485, 565, 485)
    doc.fontSize(5).fillColor('#000000').text('Sello y firma del director(a) distrital educativa y/o', 457, 486)
    doc.fontSize(5).fillColor('#000000').text('Unidad Educativa', 480, 491)
  }

  private generateSiblingsData(doc: PDFKit.PDFDocument, data: any) {
    this.generateSectionTitle(doc, 'A. HERMANA(S) O HERMANO(S) EN ETAPA DE ESCOLARIDAD EN LA UNIDAD EDUCATIVA A LA QUE POSTULA EN LA PRESENTE GESTIÓN', 300)
    const headers = ['Código rude', 'Nombre(s)', 'Nivel de educación', 'Año de escolaridad']
    const rows = (data?.registrationBrother || []).map((bro: any) => [
      bro.educationBrother?.codigo_rude || '',
      bro.educationBrother?.nombre || '',
      bro.educationBrother?.nivel || '',
      bro.educationBrother?.grado || ''
    ]);
    this.drawTable2(doc, 50, 310, headers, rows);
  }

  private generateAddressData(doc: PDFKit.PDFDocument, data: any) {
    const { registrationLocationDwelling } = data
    this.generateSectionTitle(doc, 'B. DIRECCIÓN ACTUAL DE RESIDENCIA DEL ESTUDIANTE', 350)
    this.generateField(doc, 'Municipio:', registrationLocationDwelling?.municipality, 55, 140, 365, 160)
    this.generateField(doc, 'Zona / Villa:', registrationLocationDwelling?.zoneVilla, 55, 140, 377, 160)
    this.generateField(doc, 'Avenida / Calle / N°:', registrationLocationDwelling?.avenueStreetNro, 55, 140, 389, 160)
    this.generateField(doc, 'Teléfono / Celular:', registrationLocationDwelling?.telephone, 55, 140, 401, 160)
  }

  private generateRegistrationData(doc: PDFKit.PDFDocument, data: any) {
    const { registration } = data
    this.generateSectionTitle(doc, `IV. DATOS DE PREINSCRIPCIÓN (POSTULANTES) EN LA GESTIÓN 2026`, 245)
    this.generateField(doc, 'Nivel de educación:', registration?.course?.level, 55, 175, 257, 120)
    this.generateField(doc, 'Año de escolaridad:', registration?.course?.grade, 55, 175, 269, 120)
    this.generateField(doc, 'Justificativo', registration?.criteria?.id === 1 ? 'X' : '', 55, 100, 281, 10)
    doc.text('Hermanos', 115, 281)
    this.generateField(doc, '', registration?.criteria?.id === 2 ? 'X' : '', 125, 170, 281, 10)
    doc.text('Vivienda', 185, 281)
    this.generateField(doc, '', registration?.criteria?.id === 3 ? 'X' : '', 205, 230, 281, 10)
    doc.text('Lugar de trabajo', 245, 281)
  }

  private generateSummaryData(doc: PDFKit.PDFDocument, data:any) {
    const { institution, registration, postulant, representative } = data
    // Datos de la unidad educativa
    this.generateSectionSubTitle(doc, 'DATOS DE LA UNIDAD EDUCATIVA A LA QUE POSTULA', 50, 600)
    this.generateField(doc, 'DEPARTAMENTO:', institution?.department, 50, 160, 615, 180)
    this.generateField(doc, 'DISTRITO EDUCATIVO:', institution?.district, 50, 160, 630, 180)
    this.generateField(doc, 'UNIDAD EDUCATIVA:', `${institution?.id} - ${institution?.name}`, 50, 160, 645, 180)
    this.generateField(doc, 'TURNO:', institution?.shift, 50, 160, 660, 180)
    this.generateField(doc, 'ZONA / BARRIO / VILLA', institution?.area, 50, 160, 675, 180)
    this.generateField(doc, 'NIVEL DE EDUCACIÓN:', registration?.course?.level, 50, 160, 690, 180)
    this.generateField(doc, 'AÑO DE ESCOLARIDAD:', registration?.course.grade, 50, 160, 705, 180)
    this.generateField(doc, 'N° DE CONTACTO:', representative?.cellPhone, 50, 160, 720, 180)
    // Datos del estudiante
    this.generateSectionSubTitle(doc, 'DATOS DEL ESTUDIANTE', 350, 600)
    this.generateField(doc, 'Apellido Paterno:', postulant?.lastName, 350, 405, 615, 155)
    this.generateField(doc, 'Apellido Materno:', postulant?.mothersLastName, 350, 405, 630, 155)
    this.generateField(doc, 'Nombre(s):', postulant?.name, 350, 405, 645, 155)
    this.generateField(doc, 'Cedula de Identidad:', postulant?.identityCard, 350, 405, 660, 155)
    this.generateField(doc, 'Domicilio:', 'VILLA EL CARMEN, PEDRO PADILLA', 350, 405, 675, 155)
    // firmas
    this.drawSolidLine(doc, 355, 730, 445, 730)
    doc.fontSize(5).fillColor('#000000').text('Firma del padre/madre o tutor(a)', 365, 733)

    this.drawSolidLine(doc, 465, 730, 565, 730)
    doc.fontSize(5).fillColor('#000000').text('Sello y firma del director(a) distrital educativo y/o', 463, 733)
    doc.fontSize(5).fillColor('#000000').text('unidad educativa', 480, 738)

    this.generateField(doc, 'Fecha y hora:', this.formatDateTime(data.createdAt || '', false), 55, 100, 735, 200)
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

  private async addQRCodeTOPDF(doc: any, data:any, qrCodeDataURL: string, x: number, y: number): Promise<void> {
    try {
      const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/,'')
      const qrBuffer = Buffer.from(base64Data, 'base64')
      doc.image(qrBuffer, x, y, {
        width: 20,
        height: 20,
        fit: [43, 43]
      })

      doc.fontSize(8).fillColor('red')
      .text(`N° ${data.code}`, x - 20, y + 45, { width: 80, align: 'center' });
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
    const colWidth = 128;

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

    doc.dash(options?.dash || 4, { space: options?.space || 2 })
      .stroke()
      .undash();
  }

  private formatDateTime(isoString: string, withoutTime: boolean): string {
    if (!isoString) return '';
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12;

    if(withoutTime) {
      return `${day} de ${month} de ${year}`;
    } else return `${day} de ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
  }

  private getDay(fechaISO: string): number {
    const fecha = new Date(fechaISO);
    const day = fecha.getUTCDay(); // Usa UTC porque tu fecha tiene la 'Z'
    return day;
  }
}