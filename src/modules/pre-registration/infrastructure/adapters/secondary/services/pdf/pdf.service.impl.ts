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
    // Pipe del PDF a la response
    doc.pipe(res);
    // Generar contenido del PDF
    await this.generateHeader(doc)
    this.generateSchoolData(doc, formData);
    // this.generateParentData(doc, formData);
    // this.generateStudentData(doc, formData);
    // this.generateAddressData(doc, formData);
    // this.generateSiblingsData(doc, formData);
    // this.generateRegistrationData(doc, formData);
    // this.generateFooter(doc, formData)
    doc.end()
  }

  private async generateHeader(doc: PDFKit.PDFDocument) {
    // Encabezado
    const imagePath = './fonts/logo.jpg'
    const imageWidth = 65;
    const imageHeight = 65;
    const imageX = 40;
    const imageY = 35;

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight
    })

    doc.fontSize(6)
       .font('./fonts/Montserrat-Bold.ttf')
       .text('FORMULARIO DE PRE INSCRIPCIÓN PARA EL SORTEO DE PLAZAS EN UNIDADES EDUCATIVAS DE ALTA DEMANDA PARA EDUCACIÓN', 0, 50, { align: 'center' })
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
    await this.addQRCodeTOPDF(doc, qrCodeDataURL, 520, 35)
  }

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

  private generateField(doc: PDFKit.PDFDocument, label: string, value: string, xLabel: number, xValue: number, y: number, width?: number) {
    doc.font('./fonts/Lato-Regular.ttf')
       .fontSize(6)
       .fillColor('#000000')
       .text(label, xLabel, y);

    doc.text(value || '', xValue, y, width ? { width } : {});
  }

  private drawTable(doc: PDFKit.PDFDocument, x: number, y: number, width: number, height: number, options?: { header?: string }) {
    // Fondo de header si existe
    if (options?.header) {
      doc.rect(x, y, width, 20).fill('#f0f0f0').stroke();
      doc.fillColor('#000').font('./fonts/Montserrat-Bold.ttf').text(options.header, x + 5, y + 5);
      y += 20;
      height -= 20;
    }
    doc.rect(x, y, width, height).stroke();
  }

  private generateSchoolData(doc: PDFKit.PDFDocument, data:any) {
    this.generateSectionTitle(doc, 'I. DATOS DE LA UNIDAD EDUCATIVA A LA QUE POSTULA', 95);
    this.generateField(doc, 'NOMBRE DE LA UNIDAD EDUCATIVA:', data.schoolShift || '81480018 - JOSE ALONSO DE IBAÑEZ A', 60, 180, 105);
    this.generateField(doc, 'TURNO DE LA UNIDAD EDUCATIVA:', data.schoolShift || 'MAÑANA', 60, 180, 115);
    this.generateField(doc, 'DEPENDENCIA DE LA UNIDAD EDUCATIVA:', data.schoolShift || 'FISCAL', 300, 470, 115);
    this.generateField(doc, 'DEPARTAMENTO:', data.schoolShift || 'POTOSÍ', 60, 180, 125);
    this.generateField(doc, 'MUNICIPIO:', data.schoolShift || 'POTOSÍ', 250, 300, 125);
    this.generateField(doc, 'ZONA/BARRIO/VILLA:', data.schoolShift || 'BOLIVAR Nro 997', 350, 470, 125);
  }

  private generateParentData(doc: PDFKit.PDFDocument, data: any) {
    this.generateSectionTitle(doc, 'II. DATOS DEL PADRE, MADRE O TUTOR(a) DE LA O EL ESTUDIANTE', 240);
    this.drawTable(doc, 50, 260, 550, 120, { header: 'Datos del Tutor' });
  
    this.generateField(doc, 'Apellido Paterno:', data.parentLastName || '', 60, 200, 270);
    this.generateField(doc, 'Apellido Materno:', data.parentMotherLastName || '', 60, 200, 290);
    this.generateField(doc, 'Nombre(s):', data.parentNames || '', 60, 200, 310);
    this.generateField(doc, 'Cédula de Identidad:', data.parentId || '', 60, 200, 330);
    this.generateField(doc, 'Dirección de su residencia:', data.parentAddress || '', 60, 200, 350);
    this.generateField(doc, 'En caso de tutor(s) ¿Cuál es el parentesco?', data.relationship || '', 60, 200, 370);
  }

  private generateFooter(doc: PDFKit.PDFDocument, data: any) {
    doc.moveDown(2)
       .font('./fonts/Lato-Regular.ttf')
       .fontSize(8)
       .text(`Lugar y Fecha: ${data.place || 'POTOSI'}, ${data.date || '11 DE NOVIEMBRE DE 2024'}`, 50, 900)
       .text('Firma del padre/madre o tutor(s)', 50, 930)
       .text('Firma del Director(s) y/o Responsable de la Unidad Educativa', 300, 930);
  }

}