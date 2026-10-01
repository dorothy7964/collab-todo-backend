import { GroupModule } from '@/group/group.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { GroupMemberModule } from '@/group-member/group-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    GroupModule,
    GroupMemberModule,
  ],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
