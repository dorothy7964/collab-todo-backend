import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';

import { Category } from '@/category/entities/category.entity';
import { CoreEntity } from '@/common/entities/core.entity';
import { User } from '@/user/entities/user.entity';

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
  NONE = 'NONE',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

registerEnumType(TodoPriority, {
  name: 'TodoPriority',
  description: '할 일 우선순위',
  valuesMap: {
    NONE: { description: '설정 안 함' },
    HIGH: { description: '높음' },
    MEDIUM: { description: '보통' },
    LOW: { description: '낮음' },
  },
});

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

  // 카테고리
  @ManyToOne(() => Category, (category) => category.todos, {
    nullable: false,
  })
  @Field(() => Category)
  category: Category;

  // 담당자
  @ManyToOne(() => User, {
    nullable: true,
  })
  @Field(() => User, { nullable: true })
  @IsOptional()
  assignee?: User;

  // 삭제일
  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
