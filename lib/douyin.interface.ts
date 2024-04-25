export interface IDouyinConfig {
  appid: string;
  secret: string;
  getToken?: () => Promise<any | undefined>;
  saveToken?: (token: any) => Promise<void>;
}

export interface IStateResponse {
  err_no: string;
  err_tips: string;
}
export interface IAccessTokenResponse extends IStateResponse {
  data: {
    access_token?: string;
    expires_in?: number;
    error_code?: number;
    description?: string;
  };
}
