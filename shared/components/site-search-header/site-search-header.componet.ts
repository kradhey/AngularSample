import { OnInit, Component, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { ISubscription } from 'rxjs/Subscription';
import { SearchCriteria } from '../site-header/models';
import { LookupService } from 'shared/services/lookup.service';
import { Budget } from 'shared/services/budget'
import { Cities } from 'shared/services/Cities'
import { AuthService } from 'auth/auth.service';
import 'rxjs/add/operator/first';
import { Organizations } from 'shared/services/Organizations';
import { debug } from 'util';

@Component({
  selector: 'ij-site-search-header-ui',
  templateUrl: 'site-search-header.html',
  styleUrls: ['./../../../shared/components/site-header/site-header.less'],
  providers: [ConfirmationService]

})
export class SiteSearchHeaderComponent {
  public roleSearch: boolean = true;
  public budgetSearch: boolean = true;
  public locationSearch: boolean = true;
  public organizationSearch: boolean = true;
  budgets: string[];
  locations: string[];
  allBudgets: Budget[] = [];
  allOrganizations: Organizations[] = [];
  allBudgetSuggestions: string[];
  allOrganizationSuggestions: string[];
  roles: string[] = [];
  placeholders: string[] = [];

  allCities: Cities[] = [];
  allCitiesSuggestions: string[];

  model = new SearchCriteria();
  isTrue: boolean = false;
  budget: boolean = true;
  city: boolean = true
  counter: number = 0;
  minusBtn: boolean = true;
  showQuickSearch: boolean = false;
  roleHasFocus: boolean = false;
  submitted: boolean = false;
  searchByOrganization: boolean = true;
  showSearchForm: boolean;
  @ViewChild("quicksearch") quicksearch;
  @Input("mode") public mode: "full" | "mini" = "full";
  @Input("title") public title: string = null;

  @Input("showSearch") public showSearch = "false";
  @Input("menuWhiteColor") public menuWhiteColor: boolean;
  private rolesSub: ISubscription;
  private placesAutocomplete: any;
  public get isLoggedIn() {
    return this.authSvc.isLoggedIn;
  }

  constructor(
    private lookupSvc: LookupService,
    private confirmSvc: ConfirmationService,
    private authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.placeholders = [
      "1st Assistant Camera",
      "Producer",
      "Director",
      "Editor",
      "Production Designer"
    ];
    this.showSearchForm = true;
  }

  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  ngOnInit() {

    this.getOrganizationList()
    this.rolesSub = this.lookupSvc.getSearchableCrewRoles().subscribe(roles => {
      this.roles = roles.map(r => r.label);
      this.onRoleSelect("");
    });

    const criteria = SearchCriteria.FromRoute(this.route.snapshot);
    // search params not in query string
    if (!criteria.isComplete) {
      this.setDefaults();
    }
    else {
      this.model = criteria;
    }
    if (this.model.organizationName) {
      this.isTrue = true;
    }

  }
  toggleRoles() {
    
    this.roleSearch = !this.roleSearch;
  }
  toggleBudget() {
    
    this.budgetSearch = !this.budgetSearch;
  }
  toggleLocation() {
    
    this.locationSearch = !this.locationSearch;
  }
  toggleOrganization() {
    
    this.organizationSearch = !this.organizationSearch;
  }

  ngOnDestroy() {
    if (this.rolesSub) {
      this.rolesSub.unsubscribe();
    }
  }

  onCitiesKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.allCitiesSuggestions = this.allCities
      .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r.label)
      .slice(0, 5);
  }

  onBudgetsKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.allBudgetSuggestions = this.allBudgets
      .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r.label)
      .slice(0, 5);
  }
  onOrganizationKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();

    this.allOrganizationSuggestions = this.allOrganizations
      .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
      .map(r => r.label)
      .slice(0, 5);
  }


  onToggleQuickSearch() {
    this.showQuickSearch = !this.showQuickSearch;

    setTimeout(() => {
      if (this.showQuickSearch) {
        this.quicksearch.show();
      }
    }, 0);
  }

  onSearch(f) {
    // if (!this.isLoggedIn) {
    //     this.confirmSvc.confirm({
    //         message: "We only allow logged in users to search for freelancers during our beta period. Please login, first.",
    //         header: "Login Required",
    //         rejectVisible: false,
    //     });

    //     return;
    // }
    

    this.submitted = true;
    if (!this.isValid(f)) {
      return;
    }

    if (!this.model.budget) {
    //  this.city = false;
     // this.budget = false;
    }
    else if (!this.model.location) {
     // this.city = false;
    }
    //     if(this.model.role && this.model.budget && !this.model.location)
    //     {
    //       this.searchByOrganization = true;
    // }


    if ((!this.model.role)) {
      //  return false;
    }
    if (!this.budgetSearch) {
      this.model.budget = "";
    }
    if (!this.roleSearch) {
      this.model.role = "";
    }
    if (!this.locationSearch) {
      this.model.location = "";
    }
    if (!this.organizationSearch) {
      this.model.organizationName = "";
    }
    this.router.navigate(["/search"], { queryParams: this.model });
  }


  public onClear() {
    this.model.role = "";
    this.model.location = "";
    this.model.budget = "";
    this.model.organizationName = "";
  }


  onRoleSelect(role: string) {

    if (this.roles.includes(role)) {
      this.lookupSvc.getLocations(role).first().subscribe(locations => {
        this.locations = locations;
      });

      this.lookupSvc.getFilterBudgets(role).first().subscribe(budgets => {
        this.allBudgets = budgets;
        this.model.budget = "";
        this.model.location = "";
      });

      this.lookupSvc.getFilterWorkingCities(role).first().subscribe(workingCities => {
        this.allCities = workingCities;
      });
    }
    else {
      this.lookupSvc.getLocations("").first().subscribe(locations => {
        this.locations = locations;
      });

      this.lookupSvc.getFilterBudgets("").first().subscribe(budgets => {
        this.allBudgets = budgets;
        this.model.budget = "";
        this.model.location = "";
      });

      this.lookupSvc.getFilterWorkingCities("").first().subscribe(workingCities => {
        this.allCities = workingCities;
      });
    }
  }

  onBudgetSelect(event) {
    this.model.location = "";
    this.model.organizationName = "";
    this.lookupSvc.getWorkingCitiesByBudget(this.model.budget, this.model.role).first().subscribe(workingCities => {
      this.allCities = workingCities;
    });
  }
  onCityStateSelect(event) {
    this.model.organizationName = "";
    this.lookupSvc.organizationByCities(this.model.budget, this.model.role, this.model.location).first().subscribe(organizations => {
      this.allOrganizations = organizations;
    });
  }
  private setDefaults() {
    this.model.budget = ''
    this.model.location = ''
    this.model.role = '';
  }

  private isValid(form: { valid: boolean }): boolean {
    if (!form.valid) {
      if (!this.model.role) {
        this.roleHasFocus = true;
      }
      return false;
    }
    return true;
  }
  addOrganization() {
    if (this.model.role && this.model.budget && this.model.location) {

      this.lookupSvc.organizationByCities(this.model.budget, this.model.role, this.model.location).first().subscribe(organizations => {
        this.allOrganizations = organizations;
      });
    }
    this.counter = this.counter + 1;
    if (this.counter == 1) {
      this.isTrue = true;
      this.minusBtn = false;
    }
    else if (this.counter == 0) {
      this.city = true;


    }
    else if (this.counter == -1) {
      this.isTrue = false;
      this.budget = true;
      this.minusBtn = true;

    }

  }

  checkOrganization() {
    if (!this.model.role && !this.model.budget && !this.model.location) {
      this.searchByOrganization = false;
    }
  }

  getOrganizationList() {
    this.lookupSvc.organizationList().subscribe(organizations => {
      this.allOrganizations = organizations;
    });
  }

  removeOrganization() {
    this.counter = this.counter - 1;
    if (this.isTrue) {
      this.isTrue = false;
      this.minusBtn = true;
      this.model.organizationName = "";
    }
    else if (this.city) {
      this.city = false;
      this.model.location = ""

    }
    else if (this.budget) {
      this.budget = false;
      this.minusBtn = false;
      this.model.budget = "";
    }
  }
}
