import { Douyin } from "./douyin";
import { IDouyinConfig } from "./douyin.interface";
import { IPoiQueryResponse, IGoodCategoryGetResponse, IGoodTemplateGetResponse, IProductSaveRequest, IProductSaveResponse } from "./douyin-goodlife.interface";

export class DouyinGoodLife extends Douyin {
  constructor(config: IDouyinConfig) {
    super(config);
  }
  async GetShopPoiQuery(account_id: string, page: number, size: number): Promise<IPoiQueryResponse> {
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
  async GetGoodCategory(account_id?: string, query_category_type: number = 1): Promise<IGoodCategoryGetResponse> {
    const accesstokenObj = await this.ensureAccessToken();
    return await this.request({
      method: "get",
      url: "/goodlife/v1/goods/category/get/",
      data: {
        account_id,
        query_category_type,
      },
      headers: {
        "access-token": accesstokenObj.accessToken,
      },
    });
  }
  async GetGoodTemplateReq(category_id: string, product_type: number, product_sub_type?: number): Promise<IGoodTemplateGetResponse> {
    const accesstokenObj = await this.ensureAccessToken();
    return await this.request({
      method: "get",
      url: "/goodlife/v1/goods/template/get/",
      data: {
        category_id,
        product_type,
        product_sub_type,
      },
      headers: {
        "access-token": accesstokenObj.accessToken,
      },
    });
  }
  async SaveGoodProductReq(data: IProductSaveRequest): Promise<IProductSaveResponse> {
    const accesstokenObj = await this.ensureAccessToken();
    return await this.request({
      method: "post",
      url: "/goodlife/v1/goods/product/save/",
      data,
      headers: {
        "access-token": accesstokenObj.accessToken,
      },
    });
  }
}
