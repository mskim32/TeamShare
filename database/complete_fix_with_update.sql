-- Supabase 데이터베이스 완전 수정 스크립트 (수정 기능 포함)
-- 기존 데이터 문제 해결 + 제약조건 재설정 + 수정 기능 테스트

-- 1단계: 현재 데이터 상태 확인
SELECT '=== 1단계: 현재 데이터 상태 확인 ===' as step;
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 2단계: 모든 잘못된 데이터를 올바른 값으로 업데이트
SELECT '=== 2단계: 데이터 업데이트 시작 ===' as step;

-- 이전 값들을 새로운 값으로 매핑 (더 포괄적으로)
UPDATE check_entries SET item_type = '외주계약' WHERE item_type IN (
    '입찰내역', '계약', '외주계약서', '계약서', '외주계약', '계약내역'
);
UPDATE check_entries SET item_type = '외주입찰' WHERE item_type IN (
    '견적조건', '입찰', '외주입찰서', '입찰서', '외주입찰', '입찰내역'
);
UPDATE check_entries SET item_type = '견적조건' WHERE item_type IN (
    '견적', '견적서', '견적조건서', '견적조건', '견적내역'
);
UPDATE check_entries SET item_type = '내역검토' WHERE item_type IN (
    '검토', '내역', '검토서', '내역검토', '검토내역', '검토서류'
);
UPDATE check_entries SET item_type = '품의/보고' WHERE item_type IN (
    '품의서', '보고서', '품의', '보고', '품의/보고', '품의보고'
);
UPDATE check_entries SET item_type = '기타공지' WHERE item_type IN (
    '공지사항', '공지', '기타', '알림', '기타공지', '공지사항'
);

-- 3단계: 업데이트 후 데이터 확인
SELECT '=== 3단계: 업데이트 후 데이터 확인 ===' as step;
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 4단계: 기존 제약조건 제거
SELECT '=== 4단계: 제약조건 제거 ===' as step;
ALTER TABLE check_entries DROP CONSTRAINT IF EXISTS check_entries_item_type_check;

-- 5단계: 새로운 제약조건 추가
SELECT '=== 5단계: 새로운 제약조건 추가 ===' as step;
ALTER TABLE check_entries ADD CONSTRAINT check_entries_item_type_check 
CHECK (item_type IN ('외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지'));

-- 6단계: 제약조건 확인
SELECT '=== 6단계: 제약조건 확인 ===' as step;
SELECT conname, contype, confrelid::regclass as table_name
FROM pg_constraint 
WHERE conname = 'check_entries_item_type_check';

-- 7단계: 새로운 데이터 추가 테스트
SELECT '=== 7단계: 새로운 데이터 추가 테스트 ===' as step;
INSERT INTO check_entries (team_id, category, item_type, review_text, created_by) 
VALUES ('test-team', '테스트', '외주계약', '새로운 데이터 추가 테스트', 'test@user.com');

-- 8단계: 데이터 수정 테스트
SELECT '=== 8단계: 데이터 수정 테스트 ===' as step;
UPDATE check_entries 
SET item_type = '외주입찰', review_text = '수정된 데이터 테스트' 
WHERE team_id = 'test-team' AND review_text = '새로운 데이터 추가 테스트';

-- 9단계: 수정 결과 확인
SELECT '=== 9단계: 수정 결과 확인 ===' as step;
SELECT id, team_id, item_type, review_text, created_by 
FROM check_entries 
WHERE team_id = 'test-team';

-- 10단계: 테스트 데이터 삭제
SELECT '=== 10단계: 테스트 데이터 정리 ===' as step;
DELETE FROM check_entries WHERE team_id = 'test-team';

-- 11단계: 최종 데이터 상태 확인
SELECT '=== 11단계: 최종 데이터 상태 확인 ===' as step;
SELECT DISTINCT item_type, COUNT(*) as count 
FROM check_entries 
GROUP BY item_type 
ORDER BY item_type;

-- 12단계: 완료 메시지
SELECT '=== 12단계: 모든 작업 완료 ===' as step;
SELECT '데이터베이스가 성공적으로 업데이트되었습니다. 이제 새로운 데이터 추가와 기존 데이터 수정이 모두 가능합니다.' as message;

-- 13단계: 사용 가능한 item_type 값 목록
SELECT '=== 13단계: 사용 가능한 item_type 값 ===' as step;
SELECT '외주계약' as item_type, '외주 계약 관련 문서' as description
UNION ALL
SELECT '외주입찰', '외주 입찰 관련 문서'
UNION ALL
SELECT '견적조건', '견적 조건 관련 문서'
UNION ALL
SELECT '내역검토', '내역 검토 관련 문서'
UNION ALL
SELECT '품의/보고', '품의 및 보고서 관련 문서'
UNION ALL
SELECT '기타공지', '기타 공지사항 관련 문서';
