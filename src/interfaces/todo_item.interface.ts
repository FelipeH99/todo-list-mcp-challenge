export interface TodoItem {
  id: number;
  listId: number; // Referencia a la lista a la que pertenece
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
