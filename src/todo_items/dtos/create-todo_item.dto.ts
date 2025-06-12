export class CreateTodoItemDto {
  listId: number;
  description: string;
  completed?: boolean; // Opcional, por defecto false
} 