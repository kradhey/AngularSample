import { CrewRole, SelectOption } from "shared/services/CrewRole";

export class CalculatorModel{
    role: CrewRole = new CrewRole("1st AC","28");
    expectedRate: SelectOption = new SelectOption("$30,000 - $200,000",3);
    rate: number = 0;
}