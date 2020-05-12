export class BudgetLevels {
  public studentBudgettext:string='';
  public ultraLowBudgetText: string = '';
  public lowBudgetText: string = '';
  public industryScaleBudgetText: string = '';
  public unionRateBudgetText: string = '';

  minUltraLowProjectCount = 2;
  minUltraLowReviewCount = 1;
  minLowProjectCount = 3;
  minLowReviewCount = 2;
  minIndustryProjectCount = 3;
  minIndustryReviewCount = 3;
  minUnionProjectCount = 5;
  minUnionReviewCount = 4;

  constructor(public reviewCount: number, public projectCount: number, public biography: string) {
    this.generateBudgetText();
  }

  generateBudgetText() {
    let ultraLowProjectDiff = this.minUltraLowProjectCount - this.projectCount;
    let ultraLowReviewDiff = this.minUltraLowReviewCount - this.reviewCount;

    let lowProjectDiff = this.minLowProjectCount - this.projectCount;
    let lowReviewDiff = this.minLowReviewCount - this.reviewCount;

    let industryProjectDiff = this.minIndustryProjectCount - this.projectCount;
    let industryReviewDiff = this.minIndustryReviewCount - this.reviewCount;

    let unionProjectDiff = this.minUnionProjectCount - this.projectCount;
    let unionReviewDiff = this.minUnionReviewCount - this.reviewCount;

    if (ultraLowProjectDiff > 0) {
      this.ultraLowBudgetText = `${ultraLowProjectDiff} more video${this.checkItemsCount(ultraLowProjectDiff)}`;
    }

    if (ultraLowReviewDiff > 0) {
      this.ultraLowBudgetText = this.addCommaSeperation(this.ultraLowBudgetText);
      this.ultraLowBudgetText = this.ultraLowBudgetText + `${ultraLowReviewDiff} more review${this.checkItemsCount(ultraLowReviewDiff)}`;
    }

    if(this.ultraLowBudgetText == '' && !this.biography){
      this.ultraLowBudgetText = 'must enter a biography';
    }

    if (lowProjectDiff > 0) {
      this.lowBudgetText = `${lowProjectDiff} more video${this.checkItemsCount(lowProjectDiff)}`;
    }

    if (lowReviewDiff > 0) {
      this.lowBudgetText = this.addCommaSeperation(this.lowBudgetText);
      this.lowBudgetText = this.lowBudgetText + `${lowReviewDiff} more review${this.checkItemsCount(lowReviewDiff)}`;
    }

    if (industryProjectDiff > 0) {
      this.industryScaleBudgetText = `${industryProjectDiff} more video${this.checkItemsCount(industryProjectDiff)}`;
    }

    if (industryReviewDiff > 0) {
      this.industryScaleBudgetText = this.addCommaSeperation(this.industryScaleBudgetText);
      this.industryScaleBudgetText = this.industryScaleBudgetText + `${industryReviewDiff} more review${this.checkItemsCount(industryReviewDiff)}`;
    }

    if (unionProjectDiff > 0) {
      this.unionRateBudgetText = `${unionProjectDiff} more video${this.checkItemsCount(unionProjectDiff)}`;
    }

    if (unionReviewDiff > 0) {
      this.unionRateBudgetText = this.addCommaSeperation(this.unionRateBudgetText);
      this.unionRateBudgetText = this.unionRateBudgetText + `${unionReviewDiff} more review${this.checkItemsCount(unionReviewDiff)}`;
    }
  }

  addCommaSeperation(text) {
    if (text != '')
      text = text + ', ';
    return text;
  }

  checkItemsCount(count) {
    if (count > 1)
      return 's';
    else
      return '';
  }

}