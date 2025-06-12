import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
} from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo_item.dto';
import { TodoItem } from '../interfaces/todo_item.interface';
import { TodoItemsService } from './todo_items.service';

@Controller('api')
export class TodoItemsController {
  constructor(private todoItemsService: TodoItemsService) {}

  // Obtener todos los items de una lista específica
  @Get('todolists/:listId/items')
  getItemsByList(@Param('listId') listId: number): TodoItem[] {
    return this.todoItemsService.getItemsByListId(listId);
  }

  // Obtener un item específico
  @Get('items/:id')
  getItem(@Param('id') id: number): TodoItem {
    return this.todoItemsService.getById(id);
  }

  // Crear un nuevo item en una lista específica
  @Post('todolists/:listId/items')
  createItem(
    @Param('listId') listId: number,
    @Body() dto: CreateTodoItemDto
  ): TodoItem {
    // Asegurar que el listId del parámetro coincida con el del body
    dto.listId = Number(listId);
    return this.todoItemsService.create(dto);
  }

  // Actualizar un item existente
  @Put('items/:id')
  updateItem(
    @Param('id') id: number,
    @Body() dto: UpdateTodoItemDto
  ): TodoItem {
    return this.todoItemsService.update(id, dto);
  }

  // Marcar un item como completado
  @Patch('items/:id/complete')
  completeItem(@Param('id') id: number): TodoItem {
    return this.todoItemsService.markAsCompleted(id);
  }

  // Eliminar un item
  @Delete('items/:id')
  deleteItem(@Param('id') id: number): void {
    this.todoItemsService.delete(id);
  }
} 