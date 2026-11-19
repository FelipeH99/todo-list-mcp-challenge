import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

@Module({
  imports: [],
  controllers: [TodoListsController],
  providers: [
    { provide: TodoListsService, useFactory: () => new TodoListsService([]) },
  ],
})
export class TodoListsModule {}
