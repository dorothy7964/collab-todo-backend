import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, [
  'name',
  'color',
  'sortOrder',
]) {
  @Field(() => Int)
  groupId: number;

  @Field(() => String, { nullable: true })
  categoryImage?: string;
}

@ObjectType()
export class CreateCategoryOutput extends PartialType(CoreOutput) {
  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
