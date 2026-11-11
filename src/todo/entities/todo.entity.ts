import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';

import { Category } from '@/category/entities/category.entity';
import { CoreEntity } from '@/common/entities/core.entity';
import { User } from '@/user/entities/user.entity';
import { PersonalCategory } from '@/personal-category/entities/personal-category.entity';

export enum TodoSort {
  LATEST = 'LATEST',
  OLDEST = 'OLDEST',
  PRIORITY_HIGH = 'PRIORITY_HIGH',
  PRIORITY_LOW = 'PRIORITY_LOW',
  RECENTLY_UPDATED = 'RECENTLY_UPDATED',
}
registerEnumType(TodoSort, {
  name: 'TodoSort',
  description: '할 일 정렬 기준',
  valuesMap: {
    LATEST: { description: '최신 생성순 (기본값)' },
    OLDEST: { description: '오래된 생성순' },
    PRIORITY_HIGH: { description: '높은 우선 순위순' },
    PRIORITY_LOW: { description: '낮은 우선 순위순' },
    RECENTLY_UPDATED: { description: '최근 수정순' },
  },
});

export enum TodoStatus {
  ON_HOLD = 'ON_HOLD',
  NEXT = 'NEXT',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
registerEnumType(TodoStatus, {
  name: 'TodoStatus',
  description: '할 일 상태',
  valuesMap: {
    ON_HOLD: { description: '보류' },
    TODO: { description: '할 일' },
    NEXT: { description: '다음 진행 예정' },
    IN_PROGRESS: { description: '진행중' },
    COMPLETED: { description: '완료' },
  },
});

export enum TodoPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE',
}

registerEnumType(TodoPriority, {
  name: 'TodoPriority',
  description: '할 일 우선순위',
  valuesMap: {
    HIGH: { description: '높음' },
    MEDIUM: { description: '보통' },
    LOW: { description: '낮음' },
    NONE: { description: '설정 안 함' },
  },
});

@InputType('TodoInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Todo extends CoreEntity {
  // 할 일 제목
  @Column()
  @Field(() => String)
  @IsString()
  title: string;

  // 할 일 메모
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  memo?: string;

  // 구매 장소 / 할 일 장소
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  place?: string;

  // 위도
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  // 경도
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  // 할 일 상태
  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.TODO,
  })
  @Field(() => TodoStatus)
  @IsEnum(TodoStatus)
  status: TodoStatus;

  // 우선순위
  @Column({
    type: 'enum',
    enum: TodoPriority,
    default: TodoPriority.NONE,
  })
  @Field(() => TodoPriority)
  @IsEnum(TodoPriority)
  priority: TodoPriority;

  // 정렬
  @Field(() => TodoSort, {
    nullable: true,
    defaultValue: TodoSort.LATEST,
  })
  sort?: TodoSort;

  // 그룹 카테고리
  @ManyToOne(() => Category, (category) => category.todos, {
    nullable: true,
  })
  @Field(() => Category, { nullable: true })
  category?: Category;

  // 개인 카테고리
  @ManyToOne(
    () => PersonalCategory,
    (personalCategory) => personalCategory.todos,
    { nullable: true },
  )
  @Field(() => PersonalCategory, { nullable: true })
  personalCategory?: PersonalCategory;

  // 담당자
  @ManyToOne(() => User, {
    nullable: true,
  })
  @Field(() => User, { nullable: true })
  @IsOptional()
  assignee?: User;

  // 작성자
  @ManyToOne(() => User)
  @Field(() => User)
  author: User;

  // 삭제일
  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
