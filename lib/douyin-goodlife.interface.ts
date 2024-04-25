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
  GROUPON = 1, //团购套餐,
  VIRTUAL = 2, //虚拟商品,
  PRESALE = 3, //预售券
  HOTEL_HOME = 4, //民宿
  SCENIC_TICKET = 5, //门票
  TAKE_OUT = 6, //外卖
  TRAVEL_FOLLOW_UP = 7, //旅行跟拍
  SPU_TYPE_ONE_DAY_TRIP = 8, //一日游
  HOUSE = 9, //售卖的房子
  DCD = 10, //懂车帝
  VOUCHER = 11, //代金券
  PRESALE_V2 = 12, //预售
  v2BOOKING = 13, //预定
  DELIVERY = 14, //配送商品
  TIMES_CARD = 15, //次卡
  TAKEAWAY = 16, //外卖（目前商品专项服务商用）
  AGGREGATE_TAKEAWAY = 17, //外卖聚合品（目前商品专项服务商用，只用于MSPU）
  CEC = 18, //通兑权益
  TAKEAWAY_PRESALE = 19, //外卖预售券
  CLUE = 20, //线索类
  AFFILIATED = 21, //附属商品
  APPOINTMENT = 22, //预约商品 多sku
  INSTANT_RETAIL = 23, //即使零售 多sku
  RECEPTION = 24, //接待单元
  CLUE_COLLECTOR = 25, //线索收集
  MARKETING_ASSETS = 26, //营销资产
  AGGREGATE = 27, //聚合品
}

export enum ProductSubType {
  PRESALE_TA = 1201, //旅行社预售
  BOOKING_BNOL = 1301, //先买后约 [buy now order later]
  BOOKING_OTA = 1302, //三方比价
  BOOKING_SCT = 1303, //景区日历票[scenic calendar ticket]
  BOOKING_TA = 1304, //旅行社-先买后约[travel agency]
  BOOKING_CR = 1305, //日历房[Calendar Room]
  BOOKING_PT = 1306, //演出票务[perform ticket]
  BOOKING_BT = 1307, //餐饮订座[book table]
  BOOKING_LAEV = 1308, //休娱场预订[Leisure and entertainment venues]
  BOOKING_CP = 1309, //日历套餐[calendar package]
  PCEC = 1801, //平台通兑券
  MCEC = 1802, //商家通兑券
  PCEG = 1803, //平台通兑品
  MCEG = 1804, //商家通兑品
  APPOINTMENT_DEFAULT = 2201, //预约默认
  RECEPTION_DEFAULT = 2401, //接待单元默认
  AGGREGATE_PLATFORM = 2701, //平台聚合品
  AGGREGATE_MERCHANT = 2702, //商家聚合品
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

export interface IGoodCategoryGetRequest {
  category_id?: string; //行业类目ID，返回当前id下的直系子类目信息；传0或者不传，均返回所有一级行业类目
  account_id?: string; //商户 ID，传入时服务商须与该商家满足授权关系
  query_category_type?: number; //查询类目类型，1：返回单层结构子类目信息，2：返回树形结构子类目信息
}

interface CategoryTreeInfo {
  category_id: number;
  name: string;
  parent_id: number;
  level: number;
  is_leaf: boolean;
  enable: boolean;
  sub_tree_infos: CategoryTreeInfo[];
}

export interface IGoodCategoryGetResponse extends IGoodLisfeResponse {
  data: {
    category_infos?: {
      category_id: number;
      name: string;
      parent_id: number;
      level: number;
      is_leaf: boolean;
      enable: boolean;
    }[];
    category_tree_infos?: CategoryTreeInfo[];
  };
}

export interface IGoodTemplateGetRequest {
  category_id: string; //三级品类id
  product_type: ProductType;
  product_sub_type?: ProductSubType;
}

export interface IGoodTemplateGetResponse extends IGoodLisfeResponse {
  data: {
    error_code?: number;
    description?: string;
    product_attrs: {
      desc: string; //补充描述
      is_multi: boolean; //是否是列表
      is_required: boolean; //是否必填
      key: string; //属性key
      name: string; //属性key中文名
      value_demo: string; //属性值样例
      value_type: string; //属性值类型
    }[];
    sku_attrs: {
      desc: string; //补充描述
      is_multi: boolean; //是否是列表
      is_required: boolean; //是否必填
      key: string; //属性key
      name: string; //属性key中文名
      value_demo: string; //属性值样例
      value_type: string; //属性值类型
    }[];
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
