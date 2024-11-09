export interface FilterItem {
    selected?: boolean;
    counter?: number;
    code: string;
    name: string;
    subItems?: FilterItem[];
}