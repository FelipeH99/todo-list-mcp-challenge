import { Module } from '@nestjs/common';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';

@Module({
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
  exports: [TodoItemsService], // Exportar para que el servidor MCP pueda usarlo
})
export class TodoItemsModule {}
