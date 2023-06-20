export enum TabEnum {
  Home = 'Home',
  Dashboard = 'Dashboard',
}

export interface ITab {
  name: TabEnum;
  href: string;
}
