import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './pubsub.constants';

// Common 모듈에서 애플리케이션 전체에서 사용할 PubSub을 제공한다.
// 모듈이 생성될 때 useValue를 사용해 new PubSub() 인스턴스를 생성하고,
// 이를 Provider로 등록하여 애플리케이션 전역에서 공유하도록 설정한다.

/* PubSub을 Global로 만드는 이유 */
// PubSub은 애플리케이션 전체에서 하나의 인스턴스만 사용해야 한다.
// 여러 Resolver에서 각각 PubSub을 생성하면 서로 다른 인스턴스가 되어 publish()와 subscribe()가 정상적으로 연결되지 않는다.
// 따라서 CommonModule에서 PubSub 인스턴스를 한 번만 생성하고 전역으로 공유한다.

const pubsub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubsub,
    },
  ],
  exports: [PUB_SUB],
})
export class CommonModule {}
