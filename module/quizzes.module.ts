export interface QuizEntity {
  id: number;
  name: string;
  lang_a: string;
  lang_b: string;
  active: boolean;
  revision_number: number;
  created_at: string;
  updated_at: string;
  items_count: number;
  items?: (ItemsEntity)[] | null;
}
export interface ItemsEntity {
  id: number;
  item_a: string;
  item_b: string;
  group: number|string;
  position: number;
  quiz_id: number;
  revision_number: number;
}
