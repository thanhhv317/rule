export interface BackendRule {
    _id?: string;
    fee_type: number;
    to_date: number;
    from_date: number;
    priority: number;
    active: boolean;
    name: string;
    description: string;
    type: string;
    event: string;
    conditions: string;
}