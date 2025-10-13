import { Response } from "express";

export abstract class PdfService {
  abstract generateAffidavit(formData: any, res: Response):any;
}