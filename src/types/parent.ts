export type Parent = {
  id: number;
  name: string;
  password: string;
  phone_number: string;
  is_active: boolean;

};

export interface CreateParentDTO {
  name: string;
  phone_number: string;
  password: string;
  is_active: boolean;

}

export interface UpdateParentDTO {
  name?: string;
  phone_number?: string;
  password?: string;
  is_active?: boolean;
}

export interface FormParent {
  password: string | undefined;
  name: string;
  is_active: boolean;
}

export interface ParentDrawerProps {
  opened: boolean;
  onClose: () => void;
  parent?: Parent | null;
  onSubmit: (data: CreateParentDTO | UpdateParentDTO) => void;
}
