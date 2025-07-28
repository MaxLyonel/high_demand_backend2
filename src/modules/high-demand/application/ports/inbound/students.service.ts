import { Student } from "src/modules/high-demand/domain/models/student.model";



export abstract class StudentService {
  abstract getStudentDetail(studentId: number): Promise<Student>;
}