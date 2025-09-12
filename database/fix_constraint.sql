-- Supabase 데이터베이스 즉시 업데이트 스크립트
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. 기존 CHECK 제약조건 제거
ALTER TABLE check_entries DROP CONSTRAINT IF EXISTS check_entries_item_type_check;

-- 2. 새로운 CHECK 제약조건 추가 (최신 구분 옵션)
ALTER TABLE check_entries ADD CONSTRAINT check_entries_item_type_check 
CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지'));

-- 완료 메시지
SELECT 'CHECK 제약조건이 성공적으로 업데이트되었습니다.' as message;
