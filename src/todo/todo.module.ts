import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { CategoryModule } from '@/category/category.module';
import { UserModule } from '@/user/user.module';
import { GroupMemberModule } from '@/group-member/group-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    CategoryModule,
    UserModule,
    GroupMemberModule,
  ],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
