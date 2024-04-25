import { IStateResponse } from "./douyin.interface";

export interface IDouyinExtra {
  error_code?: number;
  description?: string;
  sub_error_code?: number;
  sub_description?: string;
  logid?: string;
  now: number;
}

export interface IDouyinShopPoi {
  poi_id: string;
  poi_name: string;
  address: string;
  longitude: string;
  latitude: string;
}

export interface IDouyinRootAccount {
  account_id: string;
  account_name: string;
}

export enum ProductType {
  团购套餐 = 1,
  日历房 = 4,
  门票 = 5,
  旅行跟拍 = 7,
  一日游 = 8,
  代金券 = 11,
  新预售 = 12,
  预定商品 = 13,
  次卡 = 15,
}

export interface IGoodLisfeResponse extends IStateResponse {
  extra: IDouyinExtra;
}

export interface IPoiQueryResponse extends IGoodLisfeResponse {
  data: {
    pois: { poi: IDouyinShopPoi; root_account: IDouyinRootAccount }[];
    total: number;
    error_code?: number;
    description?: string;
  };
}

export interface IProductSaveRequest {
  product: {
    product_id?: string;
    out_id?: string;
    spu_id?: string; //创建预定商品（product_type=13）时，传入关联的 SPU ID，由创建票种接口返回；    创建预售券（product_type=12）时不传；
    product_name: string;
    category_full_name: string; //品类全名，保存时不必填写
    category_id: number; //三级品类id
    product_type: ProductType;
    product_sub_type?: number; //商品二级类型(仅小程序酒旅填写)：1201（旅行社预售） (ps：需product_type=12) (更新时不可修改)
    biz_line?: number; //业务线。（更新商品时不可修改）1：闭环自研开发者（如酒旅预售券） 5：小程序
    account_name: string;
    sold_start_time?: number; //售卖开始时间(团购商品必填）
    sold_end_time?: number; //售卖结束时间(团购商品必填）(到期自动下架)
    out_url?: string; //第三方跳转链接，小程序商品必填
    pois: {
      poi_id: string; //poiID，技术服务商保存商品填写该字段(在来客的门店管理列表中)
      supplier_ext_id?: string; //接入方店铺id， 代运营服务商保存商品选择poi_id或者supplier_ext_id其中一个字段填写
    }[];
    attr_key_value_map: {
      [key: string]: string;
    }[]; //商品属性 KV，填写时参考商品发布和查询能力。填写时查询“查询商品模板”接口，map的value中数据最后要改成json串
    product_ext?: {
      auto_online?: boolean; //是否自动上架，true / null - 审核通过自动上架; false - 审核通过不自动上架
      test_extra?: {
        uids: string[]; //商品可见的用户UID列表，["123456"]，最多10个
        test_flag: boolean; //标记商品是否为测试商品，当test_flag=true时， 1、uids数量需要大于0 ,2、小程序商品必须传trade_url ,3、库存数不能大于50 .若要取消测试标记：须指定test_flag=false
      };
    };
    sku: {
      sku_id?: string; //sku_id，创建时不必填写
      sku_name: string;
      origin_amount: number; //原价，团购创建时如有 commodity 属性可不填，会根据菜品搭配计算原价，单位分。计算方式： 菜品搭配x选n，菜品组价格从大到小排序，累加n个菜品组价格得出原价
      actual_amount: number; //实际支付价格，单位分（注：创建预售商品为必传，创建预定商品时非必传）
      stock: {
        limit_type: 1 | 2; //库存限制类型，1：有限库存，2：无限库存，2 时 stock_qty和avail_qty 字段无意义
        stock_qty?: number; //总库存，limit_type=2 时无意义
      };
      out_sku_id?: string; //第三方sku_id
      status: 1; //状态，1 为在线 ； 默认传1
      bind_skus?: string[]; //新预售商品对应的预定商品 SKU ID 列表，product_type=12 时必填，其他类型不可填，必须是有效的预定商品 SKU ID
      attr_key_value_map: {
        [key: string]: string;
      }[]; //商品属性 KV，填写时参考商品发布和查询能力。
    };
    account_id: string; //商户 ID，传入时服务商须与该商家满足授权关系
  };
}

export interface IProductSaveResponse extends IGoodLisfeResponse {
  base: {
    logid: string;
    gateway_code: number;
    gateway_msg: string;
    biz_code: number;
    biz_msg: string;
  };
  data: {
    product_id: string;
    error_code?: number;
    description?: string;
  };
}
