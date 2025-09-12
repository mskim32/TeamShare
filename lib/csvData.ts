// CSV 파일을 읽어서 객체 배열로 변환하는 유틸리티 함수

export interface CategoryData {
  name: string;
}

export interface TeamMemberData {
  name: string;
  department: string;
  email: string;
}

// CSV 문자열을 파싱하여 객체 배열로 변환
export function parseCSV<T>(csvText: string, headers: string[]): T[] {
  const lines = csvText.trim().split('\n');
  const result: T[] = [];
  
  for (let i = 1; i < lines.length; i++) { // 헤더 제외
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const obj = {} as T;
      headers.forEach((header, index) => {
        (obj as any)[header] = values[index];
      });
      result.push(obj);
    }
  }
  
  return result;
}

// 공종 데이터 로드 (업데이트된 데이터)
export function loadCategories(): CategoryData[] {
  return [
    { name: '가설사무실' },
    { name: '가설펜스' },
    { name: '안전시설물공사' },
    { name: '균열보수공사' },
    { name: '마감용비계공사' },
    { name: '영구배수공사' },
    { name: '배수판공사' },
    { name: '보강토옹벽공사' },
    { name: '조경공사' },
    { name: '조경시설물' },
    { name: '방음벽공사' },
    { name: '교통시설물공사' },
    { name: '건축토공사' },
    { name: '파일공사' },
    { name: '부대토목공사' },
    { name: '산석옹벽공사' },
    { name: '철근콘크리트공사' },
    { name: '철골공사' },
    { name: '흠음뿜칠공사' },
    { name: '데크공사' },
    { name: '습식공사' },
    { name: '방수공사' },
    { name: '코킹공사' },
    { name: '석공사' },
    { name: '도배공사' },
    { name: '인테리어공사' },
    { name: '내장목공사' },
    { name: '목창호' },
    { name: '유리공사' },
    { name: 'AL창호공사' },
    { name: '도장공사' },
    { name: '일반철물공사' },
    { name: '특화철물공사' },
    { name: '자동문공사' },
    { name: '난간대공사' },
    { name: '현관방화문' },
    { name: 'AL중문공사' },
    { name: '전기공사' },
    { name: '설비공사' },
  ];
}

// 팀원 데이터 로드 (업데이트된 데이터)
export function loadTeamMembers(): TeamMemberData[] {
  return [
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
    { name: '한현민', department: '건축외주팀', email: 'hmhan@gsenc.com' },
  ];
}