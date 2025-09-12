-- Supabase 데이터베이스 완전 수정 스크립트
-- 기존 데이터 문제 해결 + 제약조건 재설정

-- 1단계: 현재 데이터 상태 확인
SELECT '=== 현재 데이터 상태 확인 ===' as step;
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 2단계: 모든 잘못된 데이터를 올바른 값으로 업데이트
SELECT '=== 데이터 업데이트 시작 ===' as step;

-- 이전 값들을 새로운 값으로 매핑
UPDATE check_entries SET item_type = '외주계약' WHERE item_type IN ('입찰내역', '계약', '외주계약서');
UPDATE check_entries SET item_type = '외주입찰' WHERE item_type IN ('견적조건', '입찰', '외주입찰서');
UPDATE check_entries SET item_type = '견적조건' WHERE item_type IN ('견적', '견적서', '견적조건서');
UPDATE check_entries SET item_type = '내역검토' WHERE item_type IN ('검토', '내역', '검토서');
UPDATE check_entries SET item_type = '품의/보고' WHERE item_type IN ('품의서', '보고서', '품의', '보고');
UPDATE check_entries SET item_type = '기타공지' WHERE item_type IN ('공지사항', '공지', '기타', '알림');

-- 3단계: 업데이트 후 데이터 확인
SELECT '=== 업데이트 후 데이터 확인 ===' as step;
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 4단계: 기존 제약조건 제거
SELECT '=== 제약조건 제거 ===' as step;
ALTER TABLE check_entries DROP CONSTRAINT IF EXISTS check_entries_item_type_check;

-- 5단계: 새로운 제약조건 추가
SELECT '=== 새로운 제약조건 추가 ===' as step;
ALTER TABLE check_entries ADD CONSTRAINT check_entries_item_type_check 
CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지'));

-- 6단계: 제약조건 확인
SELECT '=== 제약조건 확인 ===' as step;
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'check_entries_item_type_check';

-- 7단계: 테스트 데이터 삽입 (제약조건 테스트)
SELECT '=== 제약조건 테스트 ===' as step;
-- 이 쿼리가 성공하면 제약조건이 올바르게 작동함
INSERT INTO check_entries (team_id, category, item_type, review_text, created_by) 
VALUES ('test-team', '테스트', '외주계약', '제약조건 테스트', 'test@user.com');

-- 테스트 데이터 삭제
DELETE FROM check_entries WHERE team_id = 'test-team' AND review_text = '제약조건 테스트';

-- 8단계: 완료 메시지
SELECT '=== 모든 작업 완료 ===' as step;
SELECT '데이터베이스가 성공적으로 업데이트되었습니다. 이제 새로운 데이터를 추가할 수 있습니다.' as message;
