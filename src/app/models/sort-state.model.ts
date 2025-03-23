export declare type SortStateField = 'order' | 'issueDate';
export declare type SortStateDirection = 'asc' | 'desc' | '';
export declare type SortStateKey = `${SortStateField}-${SortStateDirection}` | '';

export interface SortState {
  active: SortStateField;
  direction: SortStateDirection;
}
