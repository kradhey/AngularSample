
import { DialogHeader } from '../header/DialogHeader';
import { Budgets } from '../../services/Budget';
import { BudgetLevels } from 'shared/services/BudgetLevels';

export class BudgetLevelDialog {
  public header: DialogHeader;
  public budgetLevel: BudgetLevels;
}
export class BudgetDetails {
  public projectCount: Number;
  public reviewCount: Number;
  public defaultBudget: string;
  public biography: string;

  public projectList?: Number[];
}

export class ReviewDetails {
  public reviewCount: Number;
  public reviewUnSeenCount: Number;

}
