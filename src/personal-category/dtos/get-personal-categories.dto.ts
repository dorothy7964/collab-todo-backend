import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { PersonalCategory } from '../entities/personal-category.entity';

@InputType()
export class GetPersonalCategoriesInput {
  @Field(() => Int)
  userId: number;
}

@ObjectType()
export class GetPersonalCategoriesOutput extends CoreOutput {
  @Field(() => [PersonalCategory], { nullable: true })
  personalCategories?: PersonalCategory[];
}
