import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable()
export class MaintenanceGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    canActivate() {
        if (environment.maintenance)
            this.router.navigate(['/maintenance']);
        return false;
    }
}