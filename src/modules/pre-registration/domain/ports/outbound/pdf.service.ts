import { Response } from "express";



export abstract class PdfService {
  abstract generateRegistrationForm(formData: any, res: Response): any;
}