import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SharedModule } from 'shared/shared.module';
import { SearchService } from './search.service';

@NgModule({
    imports: [ 
        CommonModule,
        SharedModule,
        SearchRoutingModule
    ],
    declarations: [
        SearchComponent
    ],
    exports: [ 
        SearchComponent 
    ],
    providers: [
        SearchService
    ]
})
export class SearchModule {}