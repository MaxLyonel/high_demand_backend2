

export abstract class StudentService {
  abstract searchByRude(sie: number, codeRude: string)
  abstract searchByRUDE(codeRude: string): Promise<any>
}