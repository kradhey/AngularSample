import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { constants } from 'environments/constants';
import { patterns } from 'shared/view/regex-patterns';

@Directive({
    selector: '[ij-multi-email]',
    providers: [{provide: NG_VALIDATORS, useExisting: MultiEmailValidatorDirective, multi: true}]
})
export class MultiEmailValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors {
        if (this.isEmpty(control.value)) {
            return null;
        }

        const value = control.value.replace(/\s/g, '');
        const all = value.split(",");
        const allowable = value.split(",", constants.multiEmails.maxSize);
        const emails = [];
        
        if (value.split(",").length > constants.multiEmails.maxSize) {
            return {
                multiEmail: {
                    msg: `Only ${constants.multiEmails.maxSize} emails can be entered.`
                }
            }
        }

        if (value.indexOf(",") == -1) {
            emails.push(value);
        }
        else {
            const filtered = allowable.filter(v => !this.isEmpty(v));
            emails.push(...filtered)
        }
        
        if (emails.length === 0) {
            return {
                multiEmail: {
                    msg: "Please enter one or more email addresses."
                }
            }
        }

        let errored = false;
        const regex = new RegExp(patterns.email);

        for (let current of emails) {
            if (!regex.test(current)) {
                errored = true;
            }
        }

        if (errored) {
            return {
                multiEmail: {
                    msg: "One or more email addresses was invalid."
                }
            }
        }

        return null;
    }

    isEmpty(value: string) {
        return (!value || value.length === 0 || !value.trim());
    };
}