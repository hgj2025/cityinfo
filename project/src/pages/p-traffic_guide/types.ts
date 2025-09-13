
// 共享类型定义

// 城市ID类型
export type CityId = string;

// 城市名称类型
export type CityName = string;

// 交通项目类型
export interface TrafficItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  isExpanded: boolean;
}

// 交通路线类型
export interface RouteItem extends TrafficItem {
  distance: string;
  time: string;
}

// 交通方式类型
export interface TransportMethod {
  icon: string;
  title: string;
  description: string[];
}

// 侧边栏菜单项类型
export interface SideMenuItem {
  id: string;
  title: string;
  icon: string;
  link: string;
  isActive: boolean;
}
