import { Injectable, Controller, Inject } from '@nestjs/common';
import { StudentService } from "@pre-registration/domain/ports/inbound/student.service";
import { StudentRepository } from '@pre-registration/domain/ports/outbound/student.repository';



@Injectable()
export class StudentServiceImpl implements StudentService {

  constructor(
    private readonly studenRepository: StudentRepository
  ) {}

  async searchByRude(id: number, codeRude: string) {
    const student = await this.studenRepository.searchByRUDE(id, codeRude)
    return student
  }


}