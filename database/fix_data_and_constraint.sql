-- Supabase 데이터베이스 문제 해결 스크립트
-- 기존 데이터 문제를 먼저 해결한 후 제약조건 추가

-- 1. 현재 테이블의 모든 item_type 값 확인
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 2. 잘못된 값들을 새로운 값으로 업데이트
UPDATE check_entries SET item_type = '외주계약' WHERE item_type = '입찰내역';
UPDATE check_entries SET item_type = '외주입찰' WHERE item_type = '견적조건';
UPDATE check_entries SET item_type = '기타공지' WHERE item_type = '공지사항';
UPDATE check_entries SET item_type = '품의/보고' WHERE item_type = '품의서';

-- 3. 업데이트 후 다시 확인
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 4. 기존 CHECK 제약조건 제거
ALTER TABLE check_entries DROP CONSTRAINT IF EXISTS check_entries_item_type_check;

-- 5. 새로운 CHECK 제약조건 추가
ALTER TABLE check_entries ADD CONSTRAINT check_entries_item_type_check 
CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지'));

-- 6. 완료 확인
SELECT '모든 데이터가 성공적으로 업데이트되었습니다.' as message;
