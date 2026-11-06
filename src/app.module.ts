import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { CommonModule } from './common/common.module';
import { GroupMemberBan } from './group-member/entities/group-member-ban.entity';
import { GroupMember } from './group-member/entities/group-member.entity';
import { GroupMemberModule } from './group-member/group-member.module';
import { Group } from './group/entities/group.entity';
import { GroupModule } from './group/group.module';
import { JwtModule } from './jwt/jwt.module';
import { Todo } from './todo/entities/todo.entity';
import { TodoModule } from './todo/todo.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

type GraphQLWsContext = {
  connectionParams?: Record<string, unknown>;
  extra: {
    token?: string;
  };
};

type GraphQLContextOptions = {
  req?: {
    headers?: Record<string, string | string[] | undefined>;
  };
  extra?: {
    token?: unknown;
  };
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule이 전역으로 설정되어야 하는지 여부
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // 서버에 deploy 할 때 환경변수 파일을 사용하지 않기
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        TOKEN_KEY: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // port는 number 값이어야 한다. + 붙여주기
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: true,
      entities: [User, Group, GroupMember, GroupMemberBan, Category, Todo],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const TOKEN_KEY = configService.get<string>('TOKEN_KEY'); // 기본값 설정

        return {
          autoSchemaFile: true, // 스키마 자동 생성
          cors: false, // CORS는 main.ts에서 처리

          playground: process.env.NODE_ENV !== 'prod',
          introspection: process.env.NODE_ENV !== 'prod',

          subscriptions: {
            // Playground는 graphql-ws를 지원하지 않으므로 Altair GraphQL 사용
            'graphql-ws': {
              /* WebSocket 연결이 시작되면 onConnect 실행 */
              onConnect: (context: GraphQLWsContext) => {
                const { connectionParams, extra } = context;
                const token = connectionParams?.[TOKEN_KEY];

                if (typeof token !== 'string' || !token) {
                  console.log(
                    `🚨 onConnect: connectionParams에 ${TOKEN_KEY}가 없음!`,
                  );
                  return;
                }

                // <WebSocket 연결 정보에 토큰 저장>
                // extra는 graphql-ws의 연결 정보(웹소켓 자체 정보)를 저장하는 공간이다.
                // graphql-ws에서는 connectionParams가 자동으로 context로 전달되지 않는다.
                // 대신, extra 객체를 이용하여 웹소켓 연결 정보를 유지할 수 있다.
                extra.token = token;
              },
            },
          },

          /* Query, Mutation, Subscription 요청 시 Context 생성 */
          context: ({ req, extra }: GraphQLContextOptions) => {
            const headerToken: unknown = req?.headers?.[TOKEN_KEY];
            const wsToken: unknown = extra?.token;

            const token =
              (typeof headerToken === 'string' ? headerToken : null) ??
              (typeof wsToken === 'string' ? wsToken : null);

            if (!token) {
              console.log(
                `🚨 context: ${TOKEN_KEY}가 없음! 인증 문제 발생 가능`,
              );
            } else {
              console.log(`✅ context: ${TOKEN_KEY} 정상 설정됨`);
            }

            return { token };
          },
        };
      },
    }),
    GroupModule,
    GroupMemberModule,
    CommonModule,
    UserModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    CategoryModule,
    TodoModule,
  ],
})
export class AppModule {}
