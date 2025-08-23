
export type User = {
  id: number;          
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
  username: string;
  password: string;
  role_id: number; 
  is_active: boolean;
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
  role_id?: number;
  is_active?: boolean;
}
export interface FormUser {
  username: string;
  password?: string;
  role_id?: number;
  is_active: boolean;
};
