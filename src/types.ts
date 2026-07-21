export interface Organism {
  id: string;
  name: string;
  subtitle: string;
  category: 'Plant Cell' | 'White Blood Cell' | 'Neuron' | 'Epithelial Cell' | 'Bacteria Cell' | 'Animal Cell' | 'Muscle Cell' | 'Fungi';
  description: string;
  imageUrl: string;
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

export type ScreenType = 'encyclopedia' | 'visualization' | 'admin' | 'registration' | 'superadmin' | 'auth' | 'student-dashboard' | 'school-dashboard';

