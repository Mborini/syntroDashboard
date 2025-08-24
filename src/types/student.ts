export type Student = {
  id: number;
  name: string;
  class_id: number;
  class_name: string;
  section_id: number;
  section_name: string;
  is_active: boolean;
};

export interface CreateStudentDTO {
  name: string;
  section_id: number;
  is_active: boolean;
}

export interface UpdateStudentDTO {
  name?: string;
  section_id?: number;
  is_active?: boolean;
}

export interface FormStudent {
  class_id: number | undefined;
  section_id: number | undefined;
  name: string;
  
}

export interface StudentDrawerProps {
  opened: boolean;
  onClose: () => void;
  student?: Student | null;
  onSubmit: (data: CreateStudentDTO | UpdateStudentDTO) => void;
}
