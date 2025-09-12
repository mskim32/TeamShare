-- Supabase 데이터베이스 제약조건 확인 및 수정 스크립트
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. 현재 제약조건 확인
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'check_entries'::regclass 
AND contype = 'c';

-- 2. 기존 CHECK 제약조건 완전 제거
ALTER TABLE check_entries DROP CONSTRAINT IF EXISTS check_entries_item_type_check;

-- 3. 새로운 CHECK 제약조건 추가
ALTER TABLE check_entries ADD CONSTRAINT check_entries_item_type_check 
CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지'));

-- 4. 제약조건이 제대로 추가되었는지 확인
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'check_entries'::regclass 
AND contype = 'c'
AND conname = 'check_entries_item_type_check';

-- 5. 완료 메시지
SELECT 'CHECK 제약조건이 성공적으로 업데이트되었습니다.' as message;
