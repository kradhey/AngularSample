import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { HireProfileRequestDisplay } from 'shared/dialogs/hire-request/models';
import { Genders } from './Genders';
import { CrewRole, SelectOption } from './CrewRole';
import { Cities } from './Cities';
import { UnionType } from './UnionType';
import { STATES, State } from './usa-states';
import { Budget, Budgets } from './Budget';
import { BudgetProfile, BudgetProfiles } from 'shared/services/BudgetProfile'
import { Production, Productions } from 'shared/services/Production'
import { SpecialityProfile, SpecialityProfiles } from 'shared/services/SpecialityProfile';
import { CorporateStructure, CORPORATESTRUCTURES, } from 'shared/services/CorporateStructure';
import { retry } from 'rxjs/operator/retry';
import { Services } from '@angular/core/src/view';
import { Organizations } from 'shared/services/Organizations';
@Injectable()
export class LookupService {
    constructor(
        private http: HttpClient
    ) { }

    getStates(): State[] {
        return STATES;
    }

    getCorporateStructure(): CorporateStructure[] {
        return CORPORATESTRUCTURES;
    }

    getBudgets(): BudgetProfile[] {
        return BudgetProfiles;
    }

    getProduction(): Production[] {
        return Productions;
    }

    getSpeciality(): SpecialityProfile[] {
        return SpecialityProfiles;
    }

    getGenders(): string[] {
        return [
            Genders.Male,
            Genders.Female,
            Genders.Other,
            Genders.DeclineToState
        ];
    }

    getBudgetLevels(): string[] {
        return [
            Budgets.UltraLowBudget,
            Budgets.LowBudget,
            Budgets.IndustryScale,
            Budgets.UnionRates
        ];
    }

    getBudgetKeys(): string[] {
        let budgetKeys = [];
        for (var budget in Budgets) {
            budgetKeys.push(budget);
        }
        budgetKeys.splice(0, 1);
        return budgetKeys;
    }


    getGenderKeys(): string[] {
        let genderKeys = [];
        for (var gender in Genders) {
            genderKeys.push(gender);
        }
        return genderKeys;
    }

    getLocations(role: string): Observable<string[]> {
        return this.http
            .get(environment.endpoints.search.getLocations(role))
            .map(x => x as string[]);
    }

    getProjectDetails(profileSysId: string) {
        return this.http
            .get(environment.endpoints.profile.freelancer.hireResponse(profileSysId))
            .map(data => data as HireProfileRequestDisplay);
    }

    getProjectTypes(): string[] {
        return [
            "All Projects",
            "Commercial",
            "Documentary",
            "Feature Film",
            "Music Video",
            "New Media",
            "Short Film",
            "Television Show",
            "Web Series"

        ];
    }

    getBudgetRanges(): string[] {
        return [
            "$0 - $1,000",
            "$1,000 - $10,000",
            "$10,000 - $30,000",
            "$30,000 - $100,000",
            "$100,000 - $500,000",
            "$500,000 - $2,500,000",
            "$2,500,000 - $10,000,000",
            "$10,000,000 - $100,000,000",
            'Unknown'
        ];
    }

    getRateCalculatorOptions(): SelectOption[] {
        return [
            new SelectOption("$0 - $10,000",1),
            new SelectOption("$10,000 - $30,000",2),
            new SelectOption("$30,000 - $200,000",3),
            new SelectOption("$200k & over",4)
        ];
    }

    getCrewRoles(): Observable<CrewRole[]> {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.crewRoles)
            .map(this.extractRoles);
    }

    getSearchableCrewRoles(): Observable<CrewRole[]> {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.searchableCrewRoles)
            .map(this.extractRoles);
    }

    getFilterBudgets(role) {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.filterBudgets(role))
            .map(this.extractCities)
    }

    getFilterWorkingCities(role) {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.filterWorkingCities(role))
            .map(this.extractCities)
    }

    getWorkingCitiesByBudget(budget: string, role: string) {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.workingCitiesByBudget(budget, role))
            .map(this.extractCities)
    }

    getUnionTypes() {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.unionTypes)
            .map(this.extractUnions);
    }

    getCities() {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.cities)
            .map(this.extractCities)
    }

    getSearchableCities() {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.searchableCities)
            .map(this.extractCities)
    }

    getSearchableBudgets() {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.searchableBudgets)
            .map(this.extractBudgets)
    }

    get googleAutoCompleteForm() {
        return {
            street_number: 'short_name',                // plot number, street number
            route: 'long_name',                         // area name
            sublocality_level_1: 'long_name',          // sub locality
            locality: 'long_name',                      // city
            administrative_area_level_1: 'long_name',  // state
            administrative_area_level_2: 'long_name',   // county
            country: 'long_name',                       // country
            postal_town: 'long_name',                 // locality and sublocality
            postal_code: 'long_name'                   // postal code
        }
    }

    private extractRoles(response: ISiteApiResponse) {
        return response.data as CrewRole[];
    }

    private extractUnions(response: ISiteApiResponse) {
        return response.data as UnionType[];
    }

    private extractCities(response: ISiteApiResponse) {
        return response.data as Cities[];
    }

    private extractBudgets(response: ISiteApiResponse) {
        return response.data as Budget[];
    }

    organizationByCities(budget: string, role: string, location: string) {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.organizationByCities(budget, role, location))
            .map(this.extractOrganizations)
    }
    organizationList() {
        return this.http
            .get<ISiteApiResponse>(environment.endpoints.lookup.organizationList())
            .map(this.extractOrganizations)
    }

    calculateRate(crewRoleId: string, rateType: number) {
        const url = environment.endpoints.profile.freelancer.calculateRate(crewRoleId, rateType);
        return this.http
            .post<number>(url, {})
            .map(r => r);
    }

    private extractOrganizations(response: ISiteApiResponse) {
        return response.data as Organizations[];
    }

}