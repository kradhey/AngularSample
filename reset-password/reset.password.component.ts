import { Component, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup } from '@angular/forms';
import { ResetPassword } from './model'
import { AuthService, AuthResult } from 'auth/auth.service';
import { patterns } from 'shared/view/regex-patterns';

@Component({
    selector: "ij-reset-password",
    templateUrl: "reset.password.component.html",
    styleUrls: ['reset.password.less'],
})
export class ResetPasswordComponent {
    public submitted: boolean = false;
    public passwordRegex = patterns.password;
    public model: ResetPassword = new ResetPassword();
    public error: string;
    
    constructor (
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router) 
    {}

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.model.email = params['email'];
            this.model.code = params['code'];
            console.log(this.model.code);
        });
    }

    onSubmit(valid: boolean) {
        this.submitted = true;
        
        if (!valid || !this.model.code || !this.model.email) return;

        this.authService
            .resetPassword(this.model)
            .subscribe(r => this.onSuccess(r));
    }

    onSuccess(r) {
        this.router.navigate(['/login']);
    }
}