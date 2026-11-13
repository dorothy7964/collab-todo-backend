# 🗃️ Category 모듈

- 그룹 내 할 일을 분류하기 위한 카테고리 관리
- 장보기, 청소, 기타 등 그룹별 카테고리 생성 및 관리
- 할 일(Todo)을 카테고리별로 구분
- 그룹에 종속된 하위 작업 공간

<br/><br/>

## 🗃️ 카테고리 구조

- Category는 특정 Group에 소속된다.
- 하나의 Group은 여러 개의 Category를 가질 수 있다.
- 하나의 Category는 여러 개의 Todo를 가질 수 있다.

```text
Group
 ├── Category
 │    ├── Todo
 │    ├── Todo
 │    └── Todo
 │
 ├── Category
 │    ├── Todo
 │    └── Todo
 │
 └── Category
      └── Todo
```

### 그룹 / 카테고리 분류

```text
src/
├── category/                 # 그룹 카테고리
│   ├── dtos/
│   ├── entities/
│   │   └── category.entity.ts
│   ├── category.module.ts
│   ├── category.resolver.ts
│   └── category.service.ts
│
├── personal-category/        # 개인 카테고리
│   ├── dtos/
│   ├── entities/
│   │   └── personal-category.entity.ts
│   ├── personal-category.module.ts
│   ├── personal-category.resolver.ts
│   └── personal-category.service.ts
│
└── todo/
    ├── entities/
    │   └── todo.entity.ts
    ├── todo.resolver.ts
    └── todo.service.ts
```

<br/><br/>

## 🗑️ 삭제 정책

### Group — Soft Delete

- 데이터를 물리적으로 삭제하지 않고 `deletedAt`을 기록
- 그룹과 연결된 Category 및 Todo 데이터 유지
- 삭제된 그룹의 하위 데이터는 일반 조회·수정 대상에서 제외
- 필요할 경우 `restoreGroup()`을 통해 복구
- 그룹 복구 시 하위 데이터의 기존 삭제 상태를 유지 (이전에 개별 삭제한 Category/Todo를 임의 복구하지 않음)

### Category — Soft Delete

- 카테고리를 DB에서 삭제하지 않고 `deletedAt` 기록
- 연결된 Todo 데이터와 `categoryId` 관계 유지 (`NULL`로 변경하지 않음)
- 일반 카테고리 목록 및 상세 조회에서 삭제된 카테고리 제외
- 삭제된 카테고리에 속한 Todo는 일반 목록에서 제외하고, 수정·추가 작업을 제한
- `restoreCategory()`를 통해 복구 가능 (상위 Group이 활성 상태인지 확인)
- 카테고리 복구 시 Todo의 기존 삭제 상태는 그대로 유지

### Todo — Soft Delete

- Todo 삭제 시 `deletedAt` 기록
- Category 삭제만으로 Todo 자체를 삭제하거나 연결 관계를 해제하지 않음
- Category 복구 시 기존 Todo 관계를 그대로 사용
- 개별 삭제된 Todo는 `restoreTodo()`로 별도 복구

```text
카테고리 삭제 전
Category (id: 20, deletedAt: NULL)
 └── Todo (categoryId: 20, deletedAt: NULL)

          ↓ Category Soft Delete

카테고리 삭제 후
Category (id: 20, deletedAt: 삭제 시각)
 └── Todo (categoryId: 20, deletedAt: NULL)  ← 데이터 및 관계 유지

※ 일반 화면에서는 삭제된 Category와 소속 Todo를 표시하지 않음

          ↓ restoreCategory()

Category (id: 20, deletedAt: NULL)
 └── Todo (categoryId: 20, deletedAt: NULL)
```

- Category Entity에 `@DeleteDateColumn()` 적용
- Todo의 Category 관계는 기존 필수 관계를 유지할 수 있음 (`nullable: false`)
- `onDelete: 'SET NULL'`은 사용하지 않음. 이는 물리 삭제 시의 외래 키 동작으로 Soft Delete에 필요하지 않음
- TypeORM 일반 조회는 삭제된 Entity를 기본적으로 제외하며, 복구·관리 조회에는 `withDeleted: true` 사용
- Todo 조회 시 상위 Category 및 Group의 삭제 여부도 검증 (Todo 자체의 `deletedAt`만으로는 상위 삭제 상태를 판별할 수 없음)

<br/><br/>

## 구현 기능

### ➕ 카테고리 생성 (`createCategory`)

- ✅ 카테고리 이름 생성
- ✅ 카테고리 아이콘 설정
- ✅ 카테고리 색상 설정
- ✅ 그룹 소속 여부 확인
- ⬜ 그룹 멤버 권한 확인 (현재: 그룹 멤버면 생성 가능)
- ✅ 중복 카테고리 이름 확인
- ⬜ 삭제된 카테고리의 이름 중복 처리 정책 결정 (복구 시 충돌 고려)
- ✅ 카테고리 생성 완료

<br/>

### ✏️ 카테고리 수정 (`updateCategory`)

- ✅ 카테고리 이름 수정
- ✅ 카테고리 아이콘 수정
- ✅ 카테고리 색상 수정
- ✅ 카테고리 순서 변경
- ✅ 그룹 멤버 권한 확인
- ⬜ 삭제된 카테고리 수정 방지
- ✅ 카테고리 수정 완료

<br/>

### 📄 카테고리 상세 조회 (`category`)

- ✅ 카테고리 기본 정보 조회
- ✅ 카테고리 소속 그룹 확인
- ✅ 그룹 멤버 여부 확인
- ⬜ 삭제된 카테고리 조회 제외
- ⬜ 카테고리의 할 일 목록 조회
- ⬜ 전체 할 일 개수 조회
- ⬜ 완료된 할 일 개수 조회
- ⬜ 카테고리 진행률 조회

<br/>

### 🗑️ 카테고리 삭제 (`deleteCategory`)

- ✅ 카테고리 존재 여부 확인
- ✅ 그룹 소속 여부 확인
- ✅ 그룹장만 삭제 권한 부여
- ⬜ 이미 삭제된 카테고리 여부 확인
- ✅ 카테고리 Soft Delete (`deletedAt` 기록)
- ⬜ 연결된 Todo 및 `categoryId` 유지 확인
- ⬜ 일반 조회에서 삭제된 카테고리와 소속 Todo 제외
- ⬜ 카테고리 삭제 완료
- ⬜ 카테고리 삭제 취소 : restore()

<br/>

### ♻️ 카테고리 복구 (`restoreCategory`)

- ⬜ 삭제된 카테고리 조회 (`withDeleted: true`)
- ⬜ 그룹 소속 및 그룹장 권한 확인
- ⬜ 상위 그룹의 활성 상태 확인
- ⬜ 이름 중복 등 복구 충돌 확인
- ⬜ 카테고리 복구 (`deletedAt` 초기화)
- ⬜ 기존 Todo 관계 및 개별 삭제 상태 유지 확인
- ⬜ 카테고리 복구 완료

<br/>

### 📋 카테고리 목록 조회 (`getCategories`)

- ✅ 그룹별 카테고리 조회
- ⬜ 삭제된 카테고리 제외 확인
- ⬜ 카테고리별 할 일 개수 조회
- ⬜ 카테고리별 완료된 할 일 개수 조회
- ⬜ 카테고리별 진행률 조회
- ⬜ 카테고리 정렬 순서 적용

<br/><br/>

### 📋 카테고리별 할 일 목록 조회 (`getCategoryTodos`)

- ✅ 카테고리별 할 일 조회
- ✅ 그룹 멤버 여부 확인
- ⬜ 삭제된 Group/Category 접근 차단 및 삭제된 Todo 제외
- ⬜ 상태별 할 일 조회 (`ON_HOLD`, `TODO`, `NEXT`, `IN_PROGRESS`, `COMPLETED`)
- ⬜ 담당자별 할 일 조회
- ⬜ 우선순위별 조회
- ⬜ 마감일 기준 조회
- ⬜ 정렬
- ⬜ 페이지네이션

<br/><br/>

### 개인 카테고리 분리

- ✅ 개인 카테고리 생성
- ✅ 개인 카테고리 수정
- ⬜ 개인 카테고리 삭제
- ⬜ 개인 카테고리 복구
- ⬜ 개인 카테고리 순서 변경

### 개인 할 일

- ⬜ 개인 할 일 생성
- ⬜ 개인 할 일 조회
- ⬜ 개인 할 일 수정
- ⬜ 개인 할 일 삭제
- ⬜ 개인 할 일 복구
- ⬜ 개인 할 일 상태 변경
- ⬜ 개인 할 일 우선순위 변경

<br/><br/>

## 👥 카테고리 권한 (추후 예정)

### 일반 MEMBER

- ⬜ 카테고리 조회
- ⬜ 카테고리 내 Todo 조회
- ⬜ 카테고리 사용

### OWNER / ADMIN

- ⬜ 카테고리 생성
- ⬜ 카테고리 수정
- ⬜ 카테고리 삭제
- ⬜ 카테고리 복구
- ⬜ 카테고리 순서 변경

<br/><br/>

## ⭐ 기본 카테고리

그룹 생성 시 기본 카테고리를 생성할 수 있다.

예시:

- 🛒 장보기
- 🧹 청소
- 📦 기타

```text
그룹 생성
    ↓
기본 카테고리 생성
    ├── 장보기
    ├── 청소
    └── 기타
```

- ⬜ 그룹 생성 시 기본 카테고리 자동 생성
- ⬜ 기본 카테고리 이름 설정
- ⬜ 기본 카테고리 아이콘 설정
- ⬜ 기본 카테고리 순서 설정

<br/><br/>

## 📊 카테고리 진행률 (추후 예정)

활성 Category에 속한 삭제되지 않은 Todo의 완료 상태를 기준으로 진행률을 계산한다.

```text
전체 Todo = 5
완료 Todo = 3

진행률 = 3 / 5 × 100
      = 60%
```

스케치 예시:

```text
장보기     3 / 7 완료  ███████░░░
청소       1 / 5 완료  ██░░░░░░░░
기타       0 / 3 완료  ░░░░░░░░░░
```

- ⬜ 전체 Todo 개수 조회 (Soft Delete된 Todo 제외)
- ⬜ 완료 Todo 개수 조회 (`COMPLETED`)
- ⬜ 진행률 계산 (전체 Todo 0개일 때 처리 포함)
- ⬜ 그룹 화면에서 카테고리별 진행률 표시

<br/><br/>

## 🔄 카테고리 정렬

카테고리의 표시 순서를 관리한다.

```text
1. 장보기
2. 청소
3. 기타
```

- ⬜ 카테고리 순서 저장
- ⬜ 카테고리 순서 변경
- ⬜ 드래그 앤 드롭 순서 변경 지원
- ⬜ `sortOrder` 기준 조회 (삭제된 카테고리 제외)

<br/><br/>

## 🧪 테스트

### Unit Test

- ⬜ Category Service
- ⬜ Category Resolver

### E2E Test

- ⬜ 카테고리 생성
- ⬜ 카테고리 목록 조회
- ⬜ 카테고리 상세 조회
- ⬜ 카테고리 수정
- ⬜ 카테고리 Soft Delete 및 `deletedAt` 기록
- ⬜ 삭제된 카테고리 일반 조회 제외
- ⬜ 카테고리 삭제 시 Todo 데이터 및 `categoryId` 유지 확인
- ⬜ 삭제된 카테고리의 Todo 일반 조회·수정 제한
- ⬜ 카테고리 복구 및 Todo 관계 유지 확인
- ⬜ 개별 Soft Delete된 Todo가 카테고리 복구로 자동 복구되지 않는지 확인
- ⬜ 삭제된 그룹 소속 카테고리 복구 차단
- ⬜ 카테고리 순서 변경

<br/><br/>

## 개선 예정

- ⬜ 카테고리 아이콘 커스텀
- ⬜ 카테고리 색상 커스텀
- ⬜ 카테고리 순서 변경
- ⬜ 카테고리 즐겨찾기
- ⬜ 카테고리별 알림
- ⬜ 카테고리별 진행률
- ⬜ 카테고리별 통계
- ⬜ 카테고리 템플릿
- ⬜ 기본 카테고리 사용자 설정
- ⬜ 삭제된 카테고리 관리 및 복구 UI
