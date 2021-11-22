export interface Module {
  id: number;
  tag: string;
  tag_menu: string;
  icon: string;
  route: string;
  submodules?: Array<Module>;
  open?: boolean;
}
