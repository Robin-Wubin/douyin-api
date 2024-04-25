import superagent from "superagent";

import { IDouyinConfig, IAccessTokenResponse } from "./douyin.interface";

export class AccessToken {
  accessToken: string | null;
  expireTime: number;
  constructor(accessToken: string | null, expireTime: number) {
    this.accessToken = accessToken;
    this.expireTime = expireTime;
  }

  /*!
   * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比
   * Examples:
   * ```
   * token.isValid();
   * ```
   */
  isValid() {
    return !!this.accessToken && Date.now() < this.expireTime;
  }
}

export class Douyin {
  appid: string;
  private secret: string;
  getToken?: () => Promise<AccessToken | undefined>;
  saveToken?: (token: AccessToken) => Promise<void>;
  private readonly apiDouyin: string = "https://open-sandbox.douyin.com";

  constructor(readonly config: IDouyinConfig) {
    if (!config.appid) {
      throw new Error("appid 参数不能为空");
    }
    if (!config.secret) {
      throw new Error("secret 参数不能为空");
    }
    this.appid = config.appid;
    this.secret = config.secret;
    this.getToken = config.getToken;
    this.saveToken = config.saveToken;
  }

  async request(config: { baseURL?: string; method: "get" | "post" | "put" | "delete"; url: string; data?: any; headers?: any }) {
    config.url = (config.baseURL || this.apiDouyin) + config.url;
    const request = superagent[config.method](config.url);
    if (config.headers) {
      request.set(config.headers);
    }
    if (config.data) {
      if (config.method === "get") {
        request.query(config.data);
      } else {
        request.type("json");
        request.send(config.data);
      }
    }
    return await request.then(res => res.body);
  }

  /**
   * 获取小程序全局唯一后台接口调用凭据
   * @link https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/server/interface-request-credential/get-access-token/
   * @returns
   */
  async clientAccessToken(): Promise<IAccessTokenResponse> {
    const { appid, secret } = this;
    return await this.request({
      method: "post",
      url: "/oauth/client_token/",
      data: {
        client_key: appid,
        client_secret: secret,
        grant_type: "client_credential",
      },
    });
  }

  /*!
   * 根据创建API时传入的appid和appsecret获取access token
   * 进行后续所有API调用时，需要先获取access token
   * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token> * 应用开发者无需直接调用本API。 * Examples:
   * ```
   * var token = await api.getAccessToken();
   * ```
   * - `err`, 获取access token出现异常时的异常对象
   * - `result`, 成功时得到的响应结果 * Result:
   * ```
   * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
   * ```
   */
  async getAccessToken() {
    const now = Date.now();
    const token = await this.clientAccessToken();
    const { data } = token;
    const { access_token, expires_in, error_code, description } = data;
    if (error_code !== 0) throw new Error(description);
    const accessToken = new AccessToken(access_token, now + expires_in * 1000);
    await this.saveToken(accessToken);
    return accessToken;
  }

  /*!
   * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
   * 无需依赖 getAccessToken 为前置调用。
   * 应用开发者无需直接调用此API。
   * Examples:
   * ```
   * await api.ensureAccessToken();
   * ```
   */
  async ensureAccessToken(): Promise<AccessToken> {
    // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
    const token = await this.getToken();
    const { accessToken, expireTime } = token || {};
    const accessTokenObj = new AccessToken(accessToken, expireTime);
    if (token && accessTokenObj.isValid()) {
      return accessTokenObj;
    }
    return await this.getAccessToken();
  }
}
