import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { PersonalCategory } from '../entities/personal-category.entity';

@InputType()
export class CreatePersonalCategoryInput extends PickType(PersonalCategory, [
  'name',
  'color',
  'sortOrder',
]) {
  @Field(() => String, { nullable: true })
  categoryImage?: string;
}

@ObjectType()
export class CreatePersonalCategoryOutput extends PartialType(CoreOutput) {
  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
