import { ConditionType } from "./condition-type.enum";

export interface Condition {
    type: ConditionType;
    name: string;
    shortName: string;
    badgeClass: string;
}