import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalCategory } from './entities/personal-category.entity';
import { PersonalCategoryService } from './personal-category.service';
import { PersonalCategoryResolver } from './personal-category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalCategory])],
  providers: [PersonalCategoryService, PersonalCategoryResolver],
  exports: [PersonalCategoryService],
})
export class PersonalCategoryModule {}
