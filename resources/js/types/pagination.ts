export interface PaginationResponse<T> {
  data: T[];
  links: Link[];
  per_page: number;
  meta: {
    links: Link[];
  };
  to: number;
  total: number;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}
