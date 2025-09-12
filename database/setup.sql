-- V0 TeamShare Database Setup
-- Supabase에서 실행할 SQL 스크립트

-- check_entries 테이블 생성
CREATE TABLE IF NOT EXISTS check_entries (
  id SERIAL PRIMARY KEY,
  team_id TEXT NOT NULL,
  category TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의서', '공지사항')),
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

-- 팀별 접근 제어 정책 (인증된 사용자만 접근 가능)
CREATE POLICY "인증된 사용자만 접근 가능" ON check_entries
  FOR ALL USING (auth.role() = 'authenticated');

-- 첨부파일용 스토리지 버킷 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- 스토리지 정책
CREATE POLICY "인증된 사용자만 파일 업로드" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "인증된 사용자만 파일 다운로드" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attachments' AND 
    auth.role() = 'authenticated'
  );

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_check_entries_updated_at 
    BEFORE UPDATE ON check_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Realtime 활성화 (Supabase 대시보드에서도 설정 가능)
ALTER PUBLICATION supabase_realtime ADD TABLE check_entries;
