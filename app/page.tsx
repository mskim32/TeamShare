'use client';
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import clsx from 'clsx';

/** ====== CSV 데이터 로더 (내장) ====== */
const categories = [
  { name: '공통사항' }, { name: '가설사무실' }, { name: '가설펜스' }, { name: '안전시설물공사' }, { name: '균열보수공사' },
  { name: '마감용비계공사' }, { name: '영구배수공사' }, { name: '배수판공사' }, { name: '보강토옹벽공사' },
  { name: '조경공사' }, { name: '조경시설물' }, { name: '방음벽공사' }, { name: '교통시설물공사' },
  { name: '건축토공사' }, { name: '파일공사' }, { name: '부대토목공사' }, { name: '산석옹벽공사' },
  { name: '철근콘크리트공사' }, { name: '철골공사' }, { name: '흠음뿜칠공사' }, { name: '데크공사' },
  { name: '습식공사' }, { name: '방수공사' }, { name: '코킹공사' }, { name: '석공사' },
  { name: '도배공사' }, { name: '인테리어공사' }, { name: '내장목공사' }, { name: '목창호' },
  { name: '유리공사' }, { name: 'AL창호공사' }, { name: '도장공사' }, { name: '일반철물공사' },
  { name: '특화철물공사' }, { name: '자동문공사' }, { name: '난간대공사' }, { name: '현관방화문' },
  { name: 'AL중문공사' }, { name: '전기공사' }, { name: '설비공사' }
];

const itemTypes = [
  { name: '외주계약' }, { name: '외주입찰' }, { name: '견적조건' }, { name: '내역검토' },
  { name: '품의/보고' }, { name: '기타공지' }
];

const teamMembers = [
  { name: '이길재', department: '건축외주팀', email: 'gilee05@gsenc.com' },
  { name: '강성현', department: '건축외주팀', email: 'shkang5@gsenc.com' },
  { name: '김민석', department: '건축외주팀', email: 'mskim32@gsenc.com' },
  { name: '김수남', department: '건축외주팀', email: 'snkim@gsenc.com' },
  { name: '김진아', department: '건축외주팀', email: 'jakim@gsenc.com' },
  { name: '김태윤', department: '건축외주팀', email: 'tykim05@gsenc.com' },
  { name: '박성민', department: '건축외주팀', email: 'smpark100@gsenc.com' },
  { name: '박영민', department: '건축외주팀', email: 'ympark@gsenc.com' },
  { name: '성준엽', department: '건축외주팀', email: 'jysung01@gsenc.com' },
  { name: '이병길', department: '건축외주팀', email: 'bklee01@gsenc.com' },
  { name: '임혜진', department: '건축외주팀', email: 'hj@gsenc.com' },
  { name: '정재영', department: '건축외주팀', email: 'jyjeong9@gsenc.com' },
  { name: '조경록', department: '건축외주팀', email: 'krcho@gsenc.com' },
  { name: '조아림', department: '건축외주팀', email: 'arjo@gsenc.com' },
  { name: '한현민', department: '건축외주팀', email: 'hmhan@gsenc.com' }
];

/** ====== SearchableDropdown 컴포넌트 (내장) ====== */
interface DropdownOption {
  name: string;
  department?: string;
  email?: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: any;
  className?: string;
  showDepartment?: boolean;
}

function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  error,
  className,
  showDepartment = true
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.department && option.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  const selectedOption = options.find(opt => opt.name === value);

  function inputCls(err?: any) {
    return clsx('h-10 rounded-xl border px-3 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20',
      err && 'border-red-500');
  }

  return (
    <div className="relative">
      <div
        className={clsx(inputCls(error), className, 'cursor-pointer flex items-center justify-between')}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-black' : 'text-gray-500'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={`${option.name}-${index}`}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <div className="font-medium">{option.name}</div>
                {showDepartment && option.department && (
                  <div className="text-xs text-gray-500">
                    {option.department}
                  </div>
                )}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">검색 결과가 없습니다</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


/** ====== Supabase(클라이언트) 한 파일 내 포함 ====== */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);

type AttachmentMeta = { name: string; key: string; size?: number };
type Entry = {
  id:number; team_id:string; category:string; item_type:string; review_text:string;
  shared_at:string|null; author_name:string|null; note:string|null;
  link_url:string|null; attachments: AttachmentMeta[];
  created_by:string; created_at:string; updated_at:string;
};

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID || 'demo-team';

const schema = z.object({
  category: z.string().min(1, '공종은 필수'),
  item_type: z.enum(['외주계약', '외주입찰', '견적조건', '내역검토', '품의/보고', '기타공지']).default('외주계약'),
  review_text: z.string().min(1, '검토사항은 필수'),
  shared_at: z.string().optional(),
  author_name: z.string().optional(),
  note: z.string().optional(),
  link_url: z.string().url('URL 형식 확인!').or(z.literal('')).optional(),
});

/** ====== 업로드/서명URL 유틸(내장) ====== */
async function uploadFilesAndReturnKeys(files: FileList, teamId: string) {
  const results: AttachmentMeta[] = [];
  const bucket = 'attachments';
  for (const file of Array.from(files)) {
    if (file.size > 20 * 1024 * 1024) throw new Error('파일은 개당 20MB 이하만 허용됩니다.');
    const key = `${teamId}/${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^\w.\-() ]+/g,'_')}`;
    const { error } = await supabase.storage.from(bucket).upload(key, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    results.push({ name: file.name, key, size: file.size });
  }
  return results;
}
async function createSignedUrls(keys: string[], expiresInSec = 60 * 60 * 24 * 30) {
  const bucket = 'attachments'; const out: Record<string,string> = {};
  for (const key of keys) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, expiresInSec);
    if (!error && data?.signedUrl) out[key] = data.signedUrl;
  }
  return out;
}
function formatSize(size?: number) {
  if (!size) return ''; const unit=['B','KB','MB','GB']; let i=0, s=size;
  while (s>=1024&&i<unit.length-1){s/=1024;i++;} return `${s.toFixed(1)} ${unit[i]}`;
}

// 구분별 아이콘 매핑
function getItemTypeIcon(itemType: string) {
  const iconMap: Record<string, { icon: string; color: string; bgColor: string }> = {
    '외주계약': { 
      icon: '📋', 
      color: 'text-blue-700', 
      bgColor: 'bg-blue-100' 
    },
    '외주입찰': { 
      icon: '🏗️', 
      color: 'text-green-700', 
      bgColor: 'bg-green-100' 
    },
    '견적조건': { 
      icon: '💰', 
      color: 'text-yellow-700', 
      bgColor: 'bg-yellow-100' 
    },
    '내역검토': { 
      icon: '🔍', 
      color: 'text-purple-700', 
      bgColor: 'bg-purple-100' 
    },
    '품의/보고': { 
      icon: '📄', 
      color: 'text-indigo-700', 
      bgColor: 'bg-indigo-100' 
    },
    '기타공지': { 
      icon: '📢', 
      color: 'text-red-700', 
      bgColor: 'bg-red-100' 
    }
  };
  
  return iconMap[itemType] || { 
    icon: '📝', 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100' 
  };
}
function inputCls(err?: any) {
  return clsx('h-10 rounded-xl border px-3 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20',
    err && 'border-red-500');
}

/** ==================== 메인 페이지 ==================== */
export default function Page() {
  const [userEmail, setUserEmail] = useState<string|null>(null);
  const [rows, setRows] = useState<Entry[]>([]);
  const [q, setQ] = useState('');  // 검색어
  const [typeFilter, setTypeFilter] = useState<'전체'|'외주계약'|'외주입찰'|'견적조건'|'내역검토'|'품의/보고'|'기타공지'>('전체');
  const [signMap, setSignMap] = useState<Record<string,string>>({}); // key -> signedUrl
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null); // 수정 중인 항목
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // 전체 페이지에서 클립보드 이벤트 감지
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // 클립보드에서 가져온 이미지를 파일로 변환
            const fileName = `clipboard-image-${Date.now()}.png`;
            const imageFile = new File([file], fileName, { type: 'image/png' });
            setSelectedFiles(prev => [...prev, imageFile]);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // 로그인 감지
  useEffect(() => {
    // 데모 모드에서는 기본 사용자 설정
    if (supabaseUrl === 'https://demo.supabase.co') {
      setUserEmail('demo@user.com');
      return;
    }
    
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 초기 로드 + 첨부 링크 서명
  useEffect(() => {
    // 데모 모드에서는 로컬 데이터 사용
    if (supabaseUrl === 'https://demo.supabase.co') {
      console.log('데모 모드: 로컬 데이터 사용');
      return;
    }
    
    console.log('Supabase에서 데이터 로딩 중...', { supabaseUrl, TEAM_ID });
    
    supabase.from('check_entries')
      .select('*')
      .eq('team_id', TEAM_ID)
      .order('created_at', { ascending: false })
      .then(async ({ data, error }) => {
        if (error) {
          console.error('데이터 로드 오류:', error);
          return;
        }
        console.log('로드된 데이터:', data);
        if (!data) return;
        const entries = data as Entry[];
        setRows(entries);
        const keys = entries.flatMap(e => e.attachments?.map(a=>a.key) ?? []);
        const map = await createSignedUrls(keys);
        setSignMap(map);
      });
  }, []);

  // 실시간 반영
  useEffect(() => {
    // 데모 모드에서는 실시간 구독 비활성화
    if (supabaseUrl === 'https://demo.supabase.co') {
      console.log('데모 모드: 실시간 구독 비활성화');
      return;
    }
    
    console.log('실시간 구독 시작:', `entries-${TEAM_ID}`);
    
    const ch = supabase.channel(`entries-${TEAM_ID}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'check_entries', filter: `team_id=eq.${TEAM_ID}` },
        async payload => {
          console.log('실시간 변경 감지:', payload);
          if (payload.eventType === 'INSERT') {
            const e = payload.new as Entry;
            console.log('새 데이터 추가:', e);
            setRows(p => [e, ...p]);
            const map = await createSignedUrls(e.attachments?.map(a=>a.key) ?? []);
            setSignMap(prev => ({ ...prev, ...map }));
          }
          if (payload.eventType === 'UPDATE') {
            const e = payload.new as Entry;
            console.log('데이터 업데이트:', e);
            setRows(p => p.map(r => r.id === e.id ? e : r));
          }
          if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as any).id as number;
            console.log('데이터 삭제:', oldId);
            setRows(p => p.filter(r => r.id !== oldId));
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // RHF 폼
  const { register, handleSubmit, reset, formState:{errors,isSubmitting}, setValue, watch } =
    useForm<z.infer<typeof schema>>({ defaultValues: { item_type: '외주계약' } });

  const watchedCategory = watch('category');
  const watchedAuthor = watch('author_name');

  // 행 클릭 시 수정 모드로 전환
  const handleRowClick = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditMode(true);
    
    // 폼에 기존 데이터 설정
    setValue('category', entry.category);
    setValue('item_type', entry.item_type as any);
    setValue('review_text', entry.review_text);
    setValue('shared_at', entry.shared_at || '');
    setValue('author_name', entry.author_name || '');
    setValue('note', entry.note || '');
    setValue('link_url', entry.link_url || '');
  };

  // 수정 모드 취소
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setIsEditMode(false);
    reset({ item_type: '외주계약' });
  };

  // 폼 데이터 초기화
  const handleResetForm = () => {
    console.log('데이터 새로고침 버튼 클릭됨');
    reset({ item_type: '외주계약' });
    setEditingEntry(null);
    setIsEditMode(false);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    console.log('폼 초기화 완료');
  };

  // 드래그 앤 드롭 핸들러
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  // 파일 제거 핸들러
  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 이미지 파일인지 확인하는 함수
  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log('제출된 데이터:', values);
    console.log('item_type 값:', values.item_type);
    
    // 데모 모드에서는 로컬 저장
    if (supabaseUrl === 'https://demo.supabase.co') {
      const newEntry: Entry = {
        id: Date.now(),
        team_id: TEAM_ID,
        category: values.category,
        item_type: values.item_type,
        review_text: values.review_text,
        shared_at: values.shared_at || null,
        author_name: values.author_name || null,
        note: values.note || null,
        link_url: values.link_url || null,
        attachments: [],
        created_by: userEmail || 'demo@user.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      if (isEditMode && editingEntry) {
        // 수정 모드
        setRows(prev => prev.map(r => r.id === editingEntry.id ? { ...newEntry, id: editingEntry.id } : r));
        setEditingEntry(null);
        setIsEditMode(false);
      } else {
        // 추가 모드
        setRows(prev => [newEntry, ...prev]);
      }
      
      reset({ item_type: values.item_type as any });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      alert(isEditMode ? '데모 모드: 데이터가 수정되었습니다.' : '데모 모드: 데이터가 로컬에만 저장됩니다.');
      return;
    }

    let attachments: AttachmentMeta[] = [];
    if (selectedFiles.length > 0) {
      // FileList 객체 생성
      const fileList = new DataTransfer();
      selectedFiles.forEach(file => fileList.items.add(file));
      
      attachments = await uploadFilesAndReturnKeys(fileList.files, TEAM_ID);
    }
    if (isEditMode && editingEntry) {
      // 수정 모드
      const payload = {
        team_id: TEAM_ID,
        category: values.category,
        item_type: values.item_type,
        review_text: values.review_text,
        shared_at: values.shared_at || null,
        author_name: values.author_name || null,
        note: values.note || null,
        link_url: values.link_url || null,
        attachments,
      };
      
      console.log('수정 모드 - payload:', payload);
      console.log('수정 모드 - item_type:', payload.item_type);
      
      const { data: updatedData, error } = await supabase
        .from('check_entries')
        .update(payload)
        .eq('id', editingEntry.id)
        .select();
        
      if (error) { 
        console.error('수정 오류:', error);
        alert(error.message); 
        return; 
      }
      
      if (updatedData && updatedData.length > 0) {
        const updatedEntry = updatedData[0] as Entry;
        setRows(prev => prev.map(r => r.id === updatedEntry.id ? updatedEntry : r));
        setEditingEntry(null);
        setIsEditMode(false);
      }
    } else {
      // 추가 모드
      const payload = {
        team_id: TEAM_ID,
        category: values.category,
        item_type: values.item_type,
        review_text: values.review_text,
        shared_at: values.shared_at || null,
        author_name: values.author_name || null,
        note: values.note || null,
        link_url: values.link_url || null,
        attachments,
        created_by: userEmail || 'anonymous@user.com',
      };
      
      const { data: insertedData, error } = await supabase.from('check_entries').insert(payload).select();
      if (error) { 
        alert(error.message); 
        return; 
      }
      
      // 저장된 데이터를 즉시 화면에 반영
      if (insertedData && insertedData.length > 0) {
        const newEntry = insertedData[0] as Entry;
        setRows(prev => [newEntry, ...prev]);
        
        // 첨부파일 서명 URL 생성
        if (newEntry.attachments && newEntry.attachments.length > 0) {
          const keys = newEntry.attachments.map(a => a.key);
          const map = await createSignedUrls(keys);
          setSignMap(prev => ({ ...prev, ...map }));
        }
      }
    }
    
    reset({ item_type: values.item_type as any });
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // 검색/필터
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return rows.filter(r => {
      const t = typeFilter === '전체' ? true : r.item_type === typeFilter;
      const s = !text ? true :
        [r.category, r.item_type, r.review_text, r.author_name ?? '', r.note ?? '']
          .some(v => v.toLowerCase().includes(text));
      return t && s;
    });
  }, [rows, q, typeFilter]);

  async function refreshLink(key: string) {
    const map = await createSignedUrls([key], 60 * 60);
    setSignMap(prev => ({ ...prev, ...map }));
  }

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">외주팀 족보 V0</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetForm}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm cursor-pointer transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            데이터 새로고침
          </button>
          <AuthMini email={userEmail}/>
        </div>
      </header>

      {/* 입력 폼 */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select {...register('item_type')} className={inputCls(errors.item_type)}>
            <option value="" disabled>구분 *</option>
            {itemTypes.map(type => (
              <option key={type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
          <SearchableDropdown
            options={categories}
            value={watchedCategory || ''}
            onChange={(value) => setValue('category', value)}
            placeholder="공종 *"
            error={errors.category}
          />
          <input {...register('shared_at')} type="date" className={inputCls(errors.shared_at)} />
          <SearchableDropdown
            options={teamMembers}
            value={watchedAuthor || ''}
            onChange={(value) => setValue('author_name', value)}
            placeholder="작성/공유자"
            error={errors.author_name}
            showDepartment={false}
          />
          <textarea {...register('review_text', {required:true})} placeholder="검토사항 *"
            className={clsx(inputCls(errors.review_text), 'col-span-2 md:col-span-4 h-24')} />
          <input {...register('note')} placeholder="비고" className={clsx(inputCls(errors.note), 'col-span-2')} />
          <input {...register('link_url')} placeholder="Link (Teams/SharePoint/WorkChat URL)"
            className={clsx(inputCls(errors.link_url), 'col-span-2')} />

          {/* 파일 업로드 - 드래그 앤 드롭 + 화면 캡처 */}
          <div className="col-span-2 md:col-span-4">
            <div
              className={clsx(
                'border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200',
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              tabIndex={0}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">
                      파일을 드래그하여 놓거나 클릭하여 선택하세요
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      또는 화면 캡처 후 <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+V</kbd>로 바로 붙여넣기
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                  >
                    파일 선택
                  </label>
                </div>
              </div>
            </div>
            
            {/* 선택된 파일 목록 */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">선택된 파일:</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-span-2 md:col-span-4 flex gap-2">
            {isEditMode ? (
              <>
                <button 
                  disabled={isSubmitting} 
                  className="flex-1 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? '처리 중...' : '수정'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 h-10 rounded-xl bg-gray-500 text-white hover:bg-gray-600"
                >
                  취소
                </button>
              </>
            ) : (
              <button 
                disabled={isSubmitting} 
                className="w-full h-10 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSubmitting ? '처리 중...' : '추가'}
              </button>
            )}
          </div>
        </form>
        <p className="text-xs text-neutral-500 mt-2">* 파일은 개당 20MB 이하 · 민감자료는 업로드 전 권한 확인 🙏</p>
      </section>

      {/* 검색/필터 */}
      <section className="flex flex-col md:flex-row gap-3 items-start md:items-center p-4 rounded-2xl border bg-white shadow-sm">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="검색(공종/구분/검토사항/작성자/비고)"
               className="w-full md:w-1/2 h-10 rounded-xl border px-3" />
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {(['전체','외주계약','외주입찰','견적조건','내역검토','품의/보고','기타공지'] as const).map(t=>
            <button key={t} onClick={()=>setTypeFilter(t)}
              className={clsx('flex items-center gap-2 px-3 py-1 rounded-full border text-xs',
                t===typeFilter ? 'bg-neutral-900 text-white' : 'bg-white')}>
              {t !== '전체' && (
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${getItemTypeIcon(t).bgColor} ${getItemTypeIcon(t).color}`}>
                  {getItemTypeIcon(t).icon}
                </span>
              )}
              {t}
            </button>)}
        </div>
      </section>


      {/* 테이블 */}
      <section className="rounded-2xl border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 sticky top-0">
          <tr>
            {['구분','공종','검토사항','공유일자','작성/공유자','비고','Link','첨부'].map(h=>(
              <th key={h} className="p-3 border-b text-left font-medium">{h}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {filtered.map(r=>(
            <tr 
              key={r.id} 
              className="hover:bg-neutral-50 align-top cursor-pointer"
              onClick={() => handleRowClick(r)}
            >
              <td className="p-3 border-b min-w-[100px]">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${getItemTypeIcon(r.item_type).bgColor} ${getItemTypeIcon(r.item_type).color}`}>
                    {getItemTypeIcon(r.item_type).icon}
                  </span>
                  <span className="text-sm font-medium">{r.item_type}</span>
                </div>
              </td>
              <td className="p-3 border-b min-w-[120px]">{r.category}</td>
              <td className="p-3 border-b whitespace-pre-wrap min-w-[200px] max-w-[300px]">{r.review_text}</td>
              <td className="p-3 border-b min-w-[100px]">{r.shared_at ?? ''}</td>
              <td className="p-3 border-b min-w-[120px]">{r.author_name ?? ''}</td>
              <td className="p-3 border-b min-w-[150px]">{r.note ?? ''}</td>
              <td className="p-3 border-b min-w-[80px]">{r.link_url ? <a className="underline" href={r.link_url} target="_blank" onClick={(e) => e.stopPropagation()}>열기</a> : ''}</td>
              <td className="p-3 border-b min-w-[150px]">
                {r.attachments?.length ? (
                  <ul className="space-y-1">
                    {r.attachments.map(a=>{
                      const url = signMap[a.key];
                      const isImage = isImageFile(a.name);
                      return (
                        <li key={a.key} className="flex items-center gap-2 relative">
                          {url ? (
                            <div className="relative">
                              <a 
                                className="underline text-blue-600 flex items-center gap-1" 
                                href={url} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={(e) => e.stopPropagation()}
                                onMouseEnter={() => isImage && setHoveredImage(url)}
                                onMouseLeave={() => setHoveredImage(null)}
                              >
                                {isImage && (
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                )}
                                {a.name}
                              </a>
                              
                              {/* 이미지 미리보기 툴팁 */}
                              {hoveredImage === url && isImage && (
                                <div className="absolute z-50 top-full left-0 mt-2 p-2 bg-white border rounded-lg shadow-lg max-w-sm">
                                  <img 
                                    src={url} 
                                    alt={a.name}
                                    className="max-w-xs max-h-64 object-contain rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <p className="text-xs text-gray-600 mt-1 text-center">{a.name}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); refreshLink(a.key); }} className="underline">링크 갱신</button>
                          )}
                          <span className="text-xs text-neutral-400">{formatSize(a.size)}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : <span className="text-neutral-400">-</span>}
              </td>
            </tr>
          ))}
          {filtered.length===0 && (
            <tr><td colSpan={8} className="p-8 text-center text-neutral-400">데이터가 없어요. 하나 추가해볼까요? 😎</td></tr>
          )}
          </tbody>
        </table>
      </section>

      <footer className="text-xs text-neutral-500">
        실시간 · 파일 업로드 · 팀 RLS 적용(멤버십은 콘솔에서 추가) · 작성/관리자만 수정/삭제
      </footer>
    </main>
  );
}

/** ====== 간단 로그인(매직링크) ====== */
function AuthMini({ email }:{ email:string|null }) {
  const [val,setVal] = useState('');
  
  async function signIn() {
    if (supabaseUrl === 'https://demo.supabase.co') {
      alert('데모 모드: 로그인 기능이 비활성화되어 있습니다.');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ email: val });
    if (error) alert(error.message); else alert('메일함에서 로그인 링크를 눌러주세요!');
  }
  
  async function signOut(){ 
    if (supabaseUrl === 'https://demo.supabase.co') {
      alert('데모 모드: 로그아웃 기능이 비활성화되어 있습니다.');
      return;
    }
    await supabase.auth.signOut(); 
  }
  
  return email
    ? <div className="flex items-center gap-3 text-sm">
        <span className="opacity-70">{email}</span>
        {supabaseUrl === 'https://demo.supabase.co' ? (
          <span className="px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs">데모 모드</span>
        ) : (
          <button onClick={signOut} className="px-3 py-1 rounded bg-neutral-900 text-white">로그아웃</button>
        )}
      </div>
    : <div className="flex gap-2">
        <input value={val} onChange={e=>setVal(e.target.value)} placeholder="사내 이메일"
               className="h-9 border rounded px-2"/>
        <button onClick={signIn} className="px-3 py-1 rounded bg-neutral-900 text-white">로그인 링크 발송</button>
      </div>;
}