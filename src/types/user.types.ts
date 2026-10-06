export interface User {
  id: string;
  fname: string;
  lname: string;
  phone: string;
}

export type CreateUserInput = Omit<User, "id">;

export type UpdateUserInput = Partial<Omit<User, "id">>;