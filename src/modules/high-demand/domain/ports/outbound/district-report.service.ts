import { Response } from "express";


export abstract class DistrictReportService {
  abstract generateDistrictReport(formData: any, res: Response): any;
}