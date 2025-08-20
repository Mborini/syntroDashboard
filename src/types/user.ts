// src/types.ts
export type User = {
  id?: number;
  username: string;
  role: string;
  isActive?: boolean;
};

export type UserDrawerProps = {
  opened: boolean;
  onClose: () => void;
  user?: User | null; // null = add, user = edit
  onSubmit: (data: User) => void;
}