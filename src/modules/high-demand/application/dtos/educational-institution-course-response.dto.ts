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
  id: number;
  name: string;
}

// Grado con sus paralelos
export interface GradeDTO {
  id: number;
  name: string;
  parallels: ParallelDTO[];
}

// Nivel con sus grados
export interface LevelDTO {
  id: number;
  name: string;
  grades: GradeDTO[];
}


export type GroupedEducationalInstitutionCourses = LevelDTO[];
