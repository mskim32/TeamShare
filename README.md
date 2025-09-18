# V0 TeamShare - 팀 업무 내용 공유 족보

팀 업무관련 공유 내용을 한곳에 관리하고 즉시 열람하여 확인 할 수 있는 애플리케이션입니다.

## 기능

- 📝 견적조건,표준내역 등 각종 공유업무 내용 항목 관리
- 🔍 실시간 검색 및 필터링
- 📎 파일 첨부 및 다운로드
- 🔐 Supabase 인증 (매직링크)
- 📱 반응형 디자인
- ⚡ 실시간 데이터 동기화

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_TEAM_ID=your_team_id_here
```

### 3. 환경 변수 설정

#### 로컬 개발 환경
`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_TEAM_ID=your_team_id_here
```

#### Vercel 배포 환경
Vercel에서 배포할 때는 다음 환경 변수들을 설정해야 합니다:

1. **Vercel 대시보드** → **프로젝트 선택** → **Settings** → **Environment Variables**
2. 다음 변수들을 추가:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_TEAM_ID` | 팀 식별자 | `team_92909J-B01` |

3. **Supabase 대시보드**에서 **Authentication** → **URL Configuration**에서 다음 URL을 추가:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

### 4. Supabase 설정

#### 데이터베이스 테이블 생성

```sql
-- check_entries 테이블 생성
CREATE TABLE check_entries (
  id SERIAL PRIMARY KEY,
  team_id TEXT NOT NULL,
  category TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('입찰내역', '견적조건', '공통사항')),
  review_text TEXT NOT NULL,
  shared_at DATE,
  author_name TEXT,
  note TEXT,
  link_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE check_entries ENABLE ROW LEVEL SECURITY;

-- 팀별 접근 제어 정책
CREATE POLICY "팀 멤버만 접근 가능" ON check_entries
  FOR ALL USING (team_id = current_setting('app.current_team_id', true));

-- 첨부파일용 스토리지 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- 스토리지 정책
CREATE POLICY "팀 멤버만 파일 업로드" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');

CREATE POLICY "팀 멤버만 파일 다운로드" ON storage.objects
  FOR SELECT USING (bucket_id = 'attachments' AND auth.role() = 'authenticated');
```

#### 실시간 구독 설정

Supabase 대시보드에서 Realtime을 활성화하고 `check_entries` 테이블에 대한 변경사항을 구독할 수 있도록 설정하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 사용법

1. **로그인**: 사내 이메일로 매직링크 로그인
2. **항목 추가**: 공종, 구분, 검토사항 등을 입력하여 새로운 항목 추가
3. **파일 첨부**: 관련 문서나 이미지를 첨부 (최대 20MB)
4. **검색 및 필터**: 상단 검색창과 필터 버튼으로 원하는 항목 찾기
5. **실시간 동기화**: 다른 팀원이 추가한 항목이 실시간으로 반영

## 주요 특징

- **실시간 동기화**: Supabase Realtime을 통한 실시간 데이터 동기화
- **파일 관리**: Supabase Storage를 통한 안전한 파일 업로드/다운로드
- **권한 관리**: 팀별 RLS 정책으로 데이터 보안
- **반응형 UI**: 모바일과 데스크톱 모두 지원
- **타입 안전성**: TypeScript와 Zod를 통한 타입 검증

## 라이선스

MIT License

