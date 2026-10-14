# ✅ Todo 모듈

- 그룹의 카테고리별 할 일 관리
- Todo 생성, 수정, 삭제 및 완료 상태 관리
- Category에 소속되어 그룹의 작업 단위 구성

<br/><br/>

## Todo 구조

- Group
  - Category
    - Todo

<br/><br/>

## Todo 삭제

- Soft Delete : 데이터를 지우지 않고 deletedAt을 기록

<br/><br/>

## 구현 기능

### ➕ 할 일 생성 (`createTodo`)

- ✅ 카테고리 존재 여부 확인
- ✅ 그룹 멤버 여부 확인
- ✅ 할 일 제목 생성
- ✅ 할 일 설명 작성
- ✅ 담당자 지정
- ✅ 작성자 자동 지정
- ⬜ 마감일 설정
- ✅ 우선순위 설정
- ✅ 완료 상태 설정
- ✅ 할 일 생성 완료

### 📄 할 일 상세 조회 (`getTodo`)

- ✅ 할 일 존재 여부 확인
- ✅ 카테고리 소속 여부 확인
- ✅ 그룹 소속 여부 확인
- ✅ 할 일 기본 정보 조회
- ✅ 담당자 정보 조회

### 📋 카테고리별 할 일 목록 조회 (`getCategoryTodos`)

- ✅ 카테고리 존재 여부 확인
- ✅ 카테고리 소속 그룹 확인
- ✅ 그룹 멤버 여부 확인
- ✅ 해당 카테고리의 Todo 목록 조회
- ✅ 최신 생성순 정렬
- ✅ 최신순 / 오래된순 정렬
- ✅ 우선순위별 정렬
- ⬜ 상태별 필터링
- ⬜ 담당자별 필터링
- ⬜ 마감일 기준 조회
- ⬜ 페이지네이션

### ✏️ 할 일 수정 (`updateTodo`)

- ✅ 제목 수정
- ✅ 설명 수정
- ✅ 담당자 수정
- ⬜ 마감일 수정
- ✅ 우선순위 수정
- ✅ 완료 상태 수정
- ✅ 카테고리 이동

### 🔄 할 일 상태 변경 (`updateTodoStatus`)

- ✅ 할 일 존재 여부 확인
- ✅ 그룹 멤버 여부 확인
- ⬜ 변경할 상태 유효성 확인
- ✅ 할 일 상태 변경 (TodoStatus)
  - ON_HOLD: 보류
  - TODO: 할 일
  - NEXT: 다음 진행 예정
  - IN_PROGRESS: 진행중
  - COMPLETED: 완료
- ⬜ COMPLETED 변경 시 완료 시간 기록
- ⬜ COMPLETED → 다른 상태 변경 시 완료 시간 초기화

### 🗑️ 할 일 삭제 (`deleteTodo`)

- ✅ 할 일 존재 여부 확인
- ✅ 그룹 멤버 여부 확인
- ✅ 할 일 삭제
- ⬜ 할 일 삭제 취소 : restore()

<br/><br/>

## Todo 상태

### 진행 상태 (`TodoStatus`)

- `TODO` : 할 일
- `IN_PROGRESS` : 진행 중
- `DONE` : 완료

### 우선순위 (`TodoPriority`)

- `LOW` : 낮음
- `MEDIUM` : 보통
- `HIGH` : 높음

<br/><br/>

### 🔄 할 일 정렬 옵션 (`TodoSort`)

| Enum             | 설명                 | 정렬 기준                  |
| ---------------- | -------------------- | -------------------------- |
| LATEST           | 최신 생성순 (기본값) | createdAt DESC             |
| OLDEST           | 오래된 생성순        | createdAt ASC              |
| PRIORITY_HIGH    | 높은 우선순위순      | HIGH → MEDIUM → LOW → NONE |
| PRIORITY_LOW     | 낮은 우선순위순      | LOW → MEDIUM → HIGH → NONE |
| RECENTLY_UPDATED | 최근 수정순          | updatedAt DESC             |

- 기본 정렬은 `LATEST`로 설정
- 우선순위 미설정(`NONE`)은 항상 마지막에 배치
- 동일한 정렬값일 경우 `id DESC` 적용
- 우선순위 정렬은 `CASE WHEN`을 사용하여 순서 지정

<br/><br/>

## Todo 권한

- MEMBER
  - ⬜ Todo 생성
  - ⬜ Todo 조회
  - ⬜ Todo 수정
  - ⬜ Todo 완료 처리
  - ⬜ Todo 삭제

- OWNER / ADMIN
  - ⬜ 모든 Todo 관리
  - ⬜ 담당자 변경
  - ⬜ Todo 삭제

<br/><br/>

## 추후 구현

### 👤 담당자 관리

- ⬜ 담당자 지정
- ⬜ 담당자 변경
- ⬜ 담당자 해제
- ⬜ 담당자별 Todo 조회

### 📅 마감일 관리

- ⬜ 마감일 설정
- ⬜ 마감일 수정
- ⬜ 마감 임박 Todo 조회
- ⬜ 마감일 지난 Todo 조회

### 🔄 Todo 이동

- ⬜ 다른 Category로 이동
- ⬜ Category 간 Todo 이동

### 🏷️ Todo 고도화

- ⬜ Todo 태그
- ⬜ Todo 우선순위
- ⬜ Todo 반복 설정
- ⬜ Todo 체크리스트s
- ⬜ Todo 댓글
- ⬜ Todo 파일 첨부

<br/><br/>

## 테스트

### Unit Test

- ⬜ Todo Service
- ⬜ Todo Resolver

### E2E Test

- ⬜ 할 일 생성
- ⬜ 할 일 목록 조회
- ⬜ 할 일 상세 조회
- ⬜ 할 일 수정
- ⬜ 할 일 완료
- ⬜ 할 일 미완료
- ⬜ 할 일 삭제
- ⬜ 할 일 삭제 취소
- ⬜ 카테고리 간 할 일 이동

<br/><br/>

## 개선 예정

- ⬜ Todo 검색
- ⬜ Todo 정렬
- ⬜ Todo 필터링
- ⬜ Todo 페이지네이션
- ⬜ Todo 활동 로그
- ⬜ Todo 변경 이력
