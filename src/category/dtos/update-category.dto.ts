import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.dto';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  @Field(() => Number)
  categoryId?: number;

  @Field(() => Number)
  groupId?: number;
}

@ObjectType()
export class UpdateCategoryOutput extends CoreOutput {}
