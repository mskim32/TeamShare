-- Supabase Storage RLS 정책 수정 스크립트 (수정된 버전)
-- 파일 업로드 오류 해결

-- 1단계: 현재 Storage 정책 확인
SELECT '=== 1단계: 현재 Storage 정책 확인 ===' as step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'objects';

-- 2단계: 기존 Storage 정책 제거
SELECT '=== 2단계: 기존 Storage 정책 제거 ===' as step;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- 3단계: 새로운 Storage 정책 추가
SELECT '=== 3단계: 새로운 Storage 정책 추가 ===' as step;

-- 파일 업로드 허용 (모든 사용자)
CREATE POLICY "Allow all uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (true);

-- 파일 다운로드 허용 (모든 사용자)
CREATE POLICY "Allow all downloads" ON storage.objects
FOR SELECT TO public
USING (true);

-- 파일 업데이트 허용 (모든 사용자)
CREATE POLICY "Allow all updates" ON storage.objects
FOR UPDATE TO public
USING (true)
WITH CHECK (true);

-- 파일 삭제 허용 (모든 사용자)
CREATE POLICY "Allow all deletes" ON storage.objects
FOR DELETE TO public
USING (true);

-- 4단계: Storage 버킷 확인 및 생성
SELECT '=== 4단계: Storage 버킷 확인 ===' as step;
SELECT name, public, file_size_limit, allowed_mime_types
FROM storage.buckets;

-- 버킷 생성 (간단한 버전)
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-files', 'team-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5단계: 최종 정책 확인
SELECT '=== 5단계: 최종 정책 확인 ===' as step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'objects';

-- 6단계: 완료 메시지
SELECT '=== 6단계: 완료 ===' as step;
SELECT 'Storage RLS 정책이 성공적으로 설정되었습니다. 이제 파일 업로드가 가능합니다.' as message;
