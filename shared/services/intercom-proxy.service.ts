import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class IntercomProxyService {
    get intercom() {
        return (<any>window).Intercom;
    }

    boot(name: string, email: string) {
        if (!this.intercom) return false;

        this.intercom("boot", {
            app_id: environment.intercomKey,
            name,
            email
        });

        return true;
    }

    update() {
        if (!this.intercom) return false;

        this.intercom("update");

        return true;
    }

    hideLaucher() {
        if (!this.intercom) return false;

        this.intercom("update", { "hide_default_launcher": true });

        return true;
    }

    showLaucher() {
        if (!this.intercom) return false;

        this.intercom("update", { "hide_default_launcher": false });

        return true;
    }
}