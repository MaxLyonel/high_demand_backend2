import { Response } from "express";




export abstract class DepartmentReportService {
  abstract generateDepartmentReport(formData: any, res: Response): any;
}