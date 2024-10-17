export interface FilterItem {
    selected: boolean;
    highlighted: boolean;
    code: string;
    name: string;
    subItems?: FilterItem[];
}