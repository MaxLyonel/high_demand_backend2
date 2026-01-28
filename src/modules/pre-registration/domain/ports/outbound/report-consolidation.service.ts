


export abstract class ReportConsolidationService {
  abstract consolidateReports(data: Array<any>): Promise<Buffer>;
}