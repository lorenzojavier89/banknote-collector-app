import { Subregion } from "./subregion.model";

export interface Region {
  code: string;
  name: string;
  subregions: Subregion[];
}
