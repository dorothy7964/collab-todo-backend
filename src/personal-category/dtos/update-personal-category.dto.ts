import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CreatePersonalCategoryInput } from './create-personal-category.dto';

@InputType()
export class UpdatePersonalCategoryInput extends PartialType(
  CreatePersonalCategoryInput,
) {
  @Field(() => Number)
  categoryId?: number;
}

@ObjectType()
export class UpdatePersonalCategoryOutput extends CoreOutput {}
