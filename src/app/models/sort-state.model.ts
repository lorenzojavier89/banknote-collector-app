export declare type SortStateField = 'order' | 'issueDate';
export declare type SortStateDirection = 'asc' | 'desc' | '';

export interface SortState {
  active: SortStateField;
  direction: SortStateDirection;
}
