



export abstract class StudentRepository {
  abstract searchByRUDE(sie: number, codeRude: string): Promise<any>;
}