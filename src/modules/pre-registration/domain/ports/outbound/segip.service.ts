



export abstract class SegipService {
  abstract contrastar(person: any, typeCI: number): Promise<{ finalizado: boolean; mensaje: string}>
}