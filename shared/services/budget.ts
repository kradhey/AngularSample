export class Budget {
    constructor (
        public label: string,
        public value: string
    ) { }
}

export enum Budgets {
    InvisibleToPublic = "Invisible To Public",
    StudentBudget="Student Budget",
    UltraLowBudget = "Ultra Low Budget",
    LowBudget = "Low Budget",
    IndustryScale = "Industry Scale",
    UnionRates = "Union Rates"

};
export enum CompanyBudgets {
    InvisibleToPublic = "Invisible To Public",
    UltraLowBudget = "Ultra Low Budget",
    LowBudget = "Low Budget",
    IndustryScale = "Industry Scale",
    UnionRates = "Union Rates"

};

export enum BudgetStatusTypes
{
    DefaultBudget = 1,
    Upgraded = 2,
    Downgraded = 3
}