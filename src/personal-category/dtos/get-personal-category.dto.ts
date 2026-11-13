import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { PersonalCategory } from '../entities/personal-category.entity';

@InputType()
export class GetPersonalCategoryInput {
  @Field(() => Int)
  categoryId: number;
}

@ObjectType()
export class GetPersonalCategoryOutput extends CoreOutput {
  @Field(() => PersonalCategory, { nullable: true })
  personalCategory?: PersonalCategory;
}
