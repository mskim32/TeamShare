export type AttachmentMeta = {
  name: string;
  key: string;
  size?: number;
};

export type Entry = {
  id: number;
  team_id: string;
  category: string;
  item_type: string;
  review_text: string;
  shared_at: string | null;
  author_name: string | null;
  note: string | null;
  link_url: string | null;
  attachments: AttachmentMeta[];
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ItemType = '입찰내역' | '견적조건' | '공통사항';
export type TypeFilter = '전체' | ItemType;
