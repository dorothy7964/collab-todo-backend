import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { CategoryModule } from '@/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), CategoryModule],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
