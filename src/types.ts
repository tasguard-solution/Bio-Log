export type OrganismCategory = 
  | 'Plant Cell' 
  | 'White Blood Cell' 
  | 'Neuron' 
  | 'Epithelial Cell' 
  | 'Bacteria Cell' 
  | 'Animal Cell' 
  | 'Muscle Cell' 
  | 'Fungi'
  | 'Organ'
  | 'System'
  | 'Molecule'
  | 'Protist'
  | 'Plant Anatomy'
  | 'Ecology'
  | 'Genetics'
  | 'Physiology'
  | 'Immunology'
  | 'Virus';

export interface Organism {
  id: string;
  name: string;
  subtitle: string;
  category: OrganismCategory;
  description: string;
  imageUrl: string;
  sketchfabId?: string;
  imageSource?: {
    label: string;
    url: string;
    license: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  details: {
    title: string;
    content: string;
  }[];
  isFungiGroup?: boolean;
  fungiList?: FungiItem[];
}

export interface FungiItem {
  id: string;
  name: string;
  commonName: string;
  description: string;
  type: string;
  imageUrl: string;
  imageSource?: {
    label: string;
    url: string;
    license: string;
  };
}

export interface CurriculumTopic {
  title: string;
  organismIds: string[];
}

export interface CurriculumLevel {
  level: string; // e.g., 'SS1 Biology'
  topics: CurriculumTopic[];
}

export type ScreenType = 'encyclopedia' | 'visualization' | 'visualization-hub' | 'admin' | 'registration' | 'superadmin' | 'auth' | 'student-dashboard' | 'school-dashboard' | 'not-found' | 'past-questions';

export interface PastQuestion {
  id: string;
  year: number;
  paper: string; // 'May/June' | 'Nov/Dec'
  questionNumber: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic: string;
}

export interface QuizQuestion {
  id: string;
  organismId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}
