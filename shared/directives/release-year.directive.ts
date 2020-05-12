import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { constants } from 'environments/constants';

@Directive({
    selector: '[ij-release-year]',
    providers: [{provide: NG_VALIDATORS, useExisting: ReleaseYearValidatorDirective, multi: true}]
})
export class ReleaseYearValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors {
        const currentValue = control.value;
        const isValid = currentValue 
            >= constants.releaseYear.min 
            && currentValue <= constants.releaseYear.max;

        return isValid ? null : {
            releaseYear: {
                valid: false
            }
        };
    }

    constructor() { }
}