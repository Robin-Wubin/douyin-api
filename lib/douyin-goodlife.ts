import { Douyin } from "./douyin";
import { IDouyinConfig } from "./douyin.interface";
import { IPoiQueryResponse } from "./douyin-goodlife.interface";

export class DouyinGoodLife extends Douyin {
  constructor(config: IDouyinConfig) {
    super(config);
  }
  async shopPoiQuery(account_id: string, page: number, size: number): Promise<IPoiQueryResponse> {
    const accesstokenObj = await this.ensureAccessToken();
    return await this.request({
      method: "get",
      url: "/goodlife/v1/shop/poi/query/",
      data: {
        account_id,
        page,
        size,
      },
      headers: {
        "access-token": accesstokenObj.accessToken,
      },
    });
  }
}
