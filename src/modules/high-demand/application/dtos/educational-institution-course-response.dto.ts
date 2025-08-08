// Item individual
export interface EducationalInstitutionCourseResponse {
  id: number;
  educationalInstitutionId: number;
  levelType: {
    id: number;
    name: string;
  };
  gradeType: {
    id: number;
    name: string;
  };
  parallelType: {
    id: number;
    name: string;
  };
}

// Paralelo con sus items
export interface ParallelDTO {
  parallelId: number;
  parallelName: string;
}

// Grado con sus paralelos
export interface GradeDTO {
  gradeId: number;
  gradeName: string;
  parallels: ParallelDTO[];
}

// Nivel con sus grados
export interface LevelDTO {
  levelId: number;
  levelName: string;
  grades: GradeDTO[];
}


export type GroupedEducationalInstitutionCourses = LevelDTO[];
