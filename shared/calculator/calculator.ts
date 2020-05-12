import { OnInit, Component, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { CrewRole, SelectOption } from 'shared/services/CrewRole';
import { ISubscription } from 'rxjs/Subscription';
import { LookupService } from 'shared/services/lookup.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { NgForm } from '@angular/forms';
import { CalculatorModel } from './model';
@Component({
    selector: 'ij-calculator',
    templateUrl: 'calculator.html',
    styleUrls: ['./calculator.less'],

})
export class CalculatorComponent implements OnInit, OnDestroy {
    model: CalculatorModel = new CalculatorModel();
    public roleSuggestions: CrewRole[] = [];
    public allRoles: CrewRole[] = [];
    public rateTypes: SelectOption[] = [];
    public rateOptions: SelectOption[] = [];
    private roleSub: ISubscription;
    rateMask = createNumberMask({ prefix: '$ ' });
    constructor(
        private lookup: LookupService,
    ) { }

    ngOnInit() {
        this.roleSub = this.lookup.getCrewRoles().subscribe(roles => {
            this.allRoles = roles;
        });
        this.rateTypes = this.lookup.getRateCalculatorOptions();
        this.lookup.calculateRate(this.model.role.value, this.model.expectedRate.value).subscribe(rate => {
            this.model.rate = rate;
        });
    }

    ngOnDestroy() {
        if (this.roleSub) {
            this.roleSub.unsubscribe();
        }
    }

    onRolesKeyDown(event) {
        var query = (event.query || "").toLocaleLowerCase();

        this.roleSuggestions = this.allRoles
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r);
    }
    
    onRateOptionsKeyDown(event) {
        var query = (event.query || "").toLocaleLowerCase();

        this.rateOptions = this.rateTypes
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r);
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            this.model.rate = 0;
            return;
        }
        
        this.lookup.calculateRate(this.model.role.value, this.model.expectedRate.value).subscribe(rate => {
            this.model.rate = rate;
        });

    }

} 
