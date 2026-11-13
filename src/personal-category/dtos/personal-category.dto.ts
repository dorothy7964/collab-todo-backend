import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { PersonalCategory } from '../entities/personal-category.entity';

@InputType()
export class CategoryInput {
  @Field(() => Int)
  categoryId: number;
}

@ObjectType()
export class CategoryOutput extends CoreOutput {
  @Field(() => PersonalCategory, { nullable: true })
  personalCategory?: PersonalCategory;
}
