# ◽ Collab Todo Backend

> **NestJS · TypeScript · GraphQL 기반의 실시간 협업 To-do 시스템 백엔드**

실시간 협업 환경에서 여러 사용자가 동시에 To-do를 관리할 수 있도록 개발한 백엔드 프로젝트입니다.

GraphQL API와 Subscription을 활용하여 변경 사항을 실시간으로 동기화하며, JWT 인증과 TypeORM을 통해 안정적인 데이터 관리 기능을 제공합니다.

<br/><br/>

## 📌 Project Overview

### 프로젝트 소개

Collab Todo는 여러 사용자가 하나의 프로젝트에서 To-do를 생성, 수정, 삭제하며 실시간으로 변경 사항을 공유할 수 있는 협업 서비스입니다.

백엔드는 **NestJS**의 모듈 구조를 기반으로 설계하였으며, **GraphQL**을 통해 필요한 데이터만 효율적으로 조회하고, **GraphQL Subscription**을 이용하여 실시간 데이터 동기화를 구현했습니다.

<br/><br/>

## 🛠 Tech Stack

| Category       | Technology                       |
| -------------- | -------------------------------- |
| Framework      | NestJS                           |
| Language       | TypeScript                       |
| API            | GraphQL                          |
| ORM            | TypeORM                          |
| Database       | MySQL                            |
| Authentication | JWT                              |
| Real-Time      | GraphQL Subscription (WebSocket) |

<br/><br/>

## ✨ Features

- JWT 기반 회원가입 및 로그인
- 사용자 인증 및 권한 관리
- 프로젝트 생성 및 관리
- To-do 생성, 조회, 수정, 삭제(CRUD)
- 담당자 지정
- 마감일 설정
- 완료 상태 변경
- 프로젝트 멤버 협업
- GraphQL Subscription 기반 실시간 동기화

<br/><br/>

## 🏗 Architecture

```text
Client
   │
GraphQL API
   │
NestJS
 ├── Auth Module
 ├── User Module
 ├── Project Module
 ├── Todo Module
 └── GraphQL Subscription
        │
    TypeORM
        │
      MySQL
```

<br/><br/>

## 📂 Project Structure

```text
src
├── auth
├── users
├── projects
├── todos
├── graphql
├── common
├── config
├── database
└── main.ts
```

<br/><br/>

## 📖 Key Implementations

### Authentication

- JWT 기반 로그인
- 인증 및 인가 처리
- 사용자 정보 관리

### GraphQL

- Query / Mutation 구현
- Subscription을 통한 실시간 데이터 동기화
- 필요한 데이터만 조회하는 API 설계

### Database

- TypeORM Entity 설계
- 관계형 데이터 모델링
- Repository 패턴 활용

### Collaboration

- 프로젝트 단위 협업
- 실시간 Todo 변경 사항 공유
- 사용자별 권한 관리

<br/><br/>

## 🚀 Getting Started

### Environment

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

JWT_SECRET=
```

### Run

```bash
npm run start:dev
```

GraphQL Playground

```
http://localhost:3000/graphql
```

<br/><br/>

## 📸 Preview

프로젝트 완성 후 실행 화면을 추가할 예정입니다.

<br/><br/>

## 🚀 Future Improvements

- Notification 기능
- 댓글(Comment)
- 파일 첨부
- Activity Log
- Docker 적용
- CI/CD 구축
- 테스트 코드(Jest)
- Redis를 활용한 성능 개선

<br/><br/>

## 👨‍💻 What I Learned

- NestJS의 모듈 기반 아키텍처 설계
- GraphQL API 및 Subscription 구현
- JWT 인증 및 권한 관리
- TypeORM을 활용한 데이터 모델링
- 실시간 협업 서비스 구조 설계 및 구현

<br/><br/>
