export interface FilterItem {
    code: string;
    name: string;
    subItems?: FilterItem[];
    selected?: boolean;
    counter?: number;
}