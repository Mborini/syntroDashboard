import { Section } from "./section";

export interface Class {
  id: number;
  name: string;
  academic_year: string;
  academic_year_id: number; 
}


export interface CreateClassDTO {
  name: string;
  academic_year?: string;
}

export interface UpdateClassDTO {
  name?: string;
  academic_year?: string;
}

export interface ClassDrawerProps {
  opened: boolean;
  onClose: () => void;
  cls: Class | null;
  onSubmit: (data: CreateClassDTO | UpdateClassDTO) => void;
}