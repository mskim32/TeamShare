-- Supabase 데이터베이스 업데이트 스크립트
-- 기존 테이블의 CHECK 제약조건을 업데이트

-- 1. 기존 CHECK 제약조건 제거
ALTER TABLE check_entries DROP CONSTRAINT IF EXISTS check_entries_item_type_check;

-- 2. 새로운 CHECK 제약조건 추가
ALTER TABLE check_entries ADD CONSTRAINT check_entries_item_type_check 
CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지'));

-- 3. 기존 데이터가 있다면 업데이트 (선택사항)
-- UPDATE check_entries SET item_type = '외주계약' WHERE item_type = '입찰내역';
-- UPDATE check_entries SET item_type = '외주입찰' WHERE item_type = '견적조건';
-- UPDATE check_entries SET item_type = '기타공지' WHERE item_type = '공지사항';
-- UPDATE check_entries SET item_type = '품의/보고' WHERE item_type = '품의서';
