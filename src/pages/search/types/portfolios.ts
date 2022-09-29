export interface portfolioData {
    id: number;
    name: string;
    short_name: string;
    value: number;
}

export interface portfoliosByTarget {
    target_id: number;
    target_name: string;
    target_national: number;
    target_units_short: string;
    target_units: string;
    portfolios_data: Array<portfolioData>
}

export interface target {
    id: number;
    name: string;
}