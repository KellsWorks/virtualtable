export type Header = {
  editable: Boolean;
  isDefault: Boolean;
  width: string;
  label: string;
  sort: string;
  prop: string;
  url: string;
};


export type Option = {
  value: string;
  label: string;
}

export type Column  ={
  prop?: string;
  type?: string;
  component?: any;
  editable?: boolean | ((item: any) => boolean);
  options?: Option[] | string[];
  max?: number;
  min?: number;
  url?: string;
  formatter?: (value: any) => any;
}
