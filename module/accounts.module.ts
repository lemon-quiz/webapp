export interface ProfileInterface {
  id: number;
  name: string;
  email: string;
  email_verified_at?: null;
  created_at: string;
  updated_at: string;
  roles?: (RolesEntity)[] | null;
}
export interface RolesEntity {
  id: number;
  name: string;
  private: number;
  init_employee: number;
  created_at?: null;
  updated_at?: null;
  pivot: PivotRoleUser;
}
export interface PivotRoleUser {
  user_id: number;
  role_id: number;
  req_get: boolean;
  req_post: boolean;
  req_put: boolean;
  req_patch: boolean;
  req_delete: boolean;
}
