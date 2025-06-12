import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { TodoItemsModule } from './todo_items/todo_items.module';

@Module({
  imports: [TodoListsModule, TodoItemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
