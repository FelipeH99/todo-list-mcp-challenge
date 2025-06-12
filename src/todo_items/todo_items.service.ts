import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';
import { TodoItem } from '../interfaces/todo_item.interface';

@Injectable()
export class TodoItemsService {
  private readonly todoItems: TodoItem[] = [];

  constructor() {}

  // Obtener todos los items de una lista específica
  getItemsByListId(listId: number): TodoItem[] {
    return this.todoItems.filter(item => item.listId === Number(listId));
  }

  // Obtener todos los items (para el servidor MCP)
  getAllItems(): TodoItem[] {
    return this.todoItems;
  }

  // Obtener un item específico
  getById(id: number): TodoItem {
    const item = this.todoItems.find(item => item.id === Number(id));
    if (!item) {
      throw new NotFoundException(`TodoItem with ID ${id} not found`);
    }
    return item;
  }

  // Crear un nuevo item
  create(dto: CreateTodoItemDto): TodoItem {
    const newItem: TodoItem = {
      id: this.nextId(),
      listId: Number(dto.listId),
      description: dto.description,
      completed: dto.completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todoItems.push(newItem);
    return newItem;
  }

  // Actualizar un item existente
  update(id: number, dto: UpdateTodoItemDto): TodoItem {
    const item = this.getById(id);
    
    if (dto.description !== undefined) {
      item.description = dto.description;
    }
    if (dto.completed !== undefined) {
      item.completed = dto.completed;
    }
    item.updatedAt = new Date();

    return item;
  }

  // Marcar un item como completado
  markAsCompleted(id: number): TodoItem {
    const item = this.getById(id);
    item.completed = true;
    item.updatedAt = new Date();
    return item;
  }

  // Eliminar un item
  delete(id: number): void {
    const index = this.todoItems.findIndex(item => item.id === Number(id));
    if (index === -1) {
      throw new NotFoundException(`TodoItem with ID ${id} not found`);
    }
    this.todoItems.splice(index, 1);
  }

  private nextId(): number {
    const lastId = this.todoItems
      .map(item => item.id)
      .sort((a, b) => b - a)[0];
    
    return lastId ? lastId + 1 : 1;
  }
} 