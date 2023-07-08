export interface IEssentialLink {
  title: string;
  caption?: string;
  route?: { name: string, params?: { [paramsName: string]: string | number } };
  icon?: string;
}
export interface IGrowth {
  id: string;
  label: string;
  direction: 'up' |'down';
  amount: number;
  eventDate: string;
}
export interface IEvolution {
  id: string;
  createdAt: Date;
  data: IGrowth[];
}
export interface IThuneConfig {
  id: string;
  saving: number;
  data: IGrowth[];
}
