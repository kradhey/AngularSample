import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchCard } from './models';
import { ConfirmationService } from 'primeng/primeng';
import { AuthService } from 'auth/auth.service';

@Component({
    selector: 'ij-search-card',
    templateUrl: './search-card.component.html',
    styleUrls: ['./styles.less'],
    providers: [ConfirmationService]
})
export class SearchCardComponent {
    @Input('card')
    public card: SearchCard;

    @Output('onRefer')
    public onRefer$ = new EventEmitter<string>();

    constructor(
        private confirmSvc: ConfirmationService,
        private authSvc: AuthService,
    ) { }

    onRefer(profileSysId: string) {
        if (!this.authSvc.isLoggedIn) {
            this.confirmSvc.confirm({
                message: "We only allow logged in users refer, contact and hire. Please login or create an account",
                header: "Login Required",
                rejectVisible: false,
            });

            return;
        }
        this.onRefer$.emit(profileSysId);
    }
}