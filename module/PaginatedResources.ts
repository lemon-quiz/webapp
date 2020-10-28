export interface PaginatedResources<T = any> {
  current_page: number;
  data: Array<T>;
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
export interface LinksEntity {
  url?: string | null;
  label: string | number;
  active: boolean;
}
