
export type User = {
  id: number;     
  name: string;     
  username: string;
  role: string;
  role_id?: number;     
  is_active: boolean;
  password?: string;    
};

export type UserDrawerProps = {
  opened: boolean;
  onClose: () => void;
  user?: User | null; 
  onSubmit: (data: CreateUserDTO | UpdateUserDTO) => void;
};

// user.types.ts
export interface CreateUserDTO {
  name: string;
  username: string;
  password: string;
  role_id: number; 
  is_active: boolean;
}

export interface UpdateUserDTO {
  name: string;
  username?: string;
  password?: string;
  role_id?: number;
  is_active?: boolean;
}
export interface FormUser {
  name: string;
  username: string;
  password?: string;
  role_id?: number;
  is_active: boolean;
};
