export type AccountStatus = "ACTIVE" | "INACTIVE";

export interface AccountView {
  accId: string;
  accName: string;
  accEmail: string;
  accPhone: string;
  roleName: string;
  depName: string | null;
  accStatus: AccountStatus;
}

export interface BaseAccountDetail {
  accId: string;
  accName: string;
  accEmail: string;
  accIsMale: boolean;
  accDob: string;
  accPhone: string;
  accStatus: AccountStatus;
}

export interface CandidateAccountDetail extends BaseAccountDetail {
  candExpYear: number;
  candCvPath: string;
  candMajor: string;
  skills: string[];
  dtName: string;
}

export interface AdminAccountDetail extends BaseAccountDetail {
  roleName: string;
  depName: string | null;
}

export type AccountDetail =
  | CandidateAccountDetail
  | AdminAccountDetail;

export interface AdminAccountCreateDTO {
  email: string;
  roleId: string;
  depId: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface AccountFilterParams {
  keyword?: string;
  roleId?: string;
  depId?: string;
  status?: AccountStatus | "ALL";
  page?: number;
  size?: number;
}
