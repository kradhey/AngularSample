import { ActivatedRouteSnapshot } from '@angular/router';

export class SearchCriteria {
    public static readonly DateFormat: string = "MM-DD-YYYY";
    
    public role: string;
    public budget: string;
    public location: string;
    public organizationName: string;
    public get isComplete(): boolean {
        return ((this.role != null && this.budget != null && this.location != null) || this.organizationName != null);
    }

    public static FromRoute(route: ActivatedRouteSnapshot) {
        let model = new SearchCriteria();
        model.budget = route.queryParamMap.get('budget');
        model.location = route.queryParamMap.get('location');
        model.role = route.queryParamMap.get('role');
        model.organizationName = route.queryParamMap.get('organizationName');
        return model;
    }
};
