export interface EventsServiceInterface {
  current_page: number;
  data?: (DataEntity)[] | null;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links?: (LinksEntity)[] | null;
  next_page_url?: null;
  path: string;
  per_page: number;
  prev_page_url?: null;
  to: number;
  total: number;
}
export interface DataEntity {
  id: string;
  command_id: string;
  resource_id: string;
  model: string;
  class: string;
  payload: string;
  revision_number: number;
  author_id: string;
  key: string;
  created_at: string;
  updated_at: string;
}
export interface LinksEntity {
  url?: string | null;
  label: string | number;
  active: boolean;
}
