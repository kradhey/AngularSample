import { NgModule } from "@angular/core";
import { ProjectComponent } from "./project.component";
import { ProjectRoutingModule } from "./project.routing.module";
import { ProjectHeaderComponent } from "./project.header.component";
import { AllJobsComponent } from "./all-jobs/all-jobs.component";
import { SharedModule } from "shared/shared.module";
import { OffersComponent } from "./offers/offers.component";

@NgModule({
    imports: [ 
        SharedModule,
        ProjectRoutingModule
    ],
    declarations: [
        ProjectComponent,
        ProjectHeaderComponent,
        AllJobsComponent,
        OffersComponent
    ],
    exports: [ 
        ProjectComponent
    ],
    providers: [
    ]
})
export class ProjectModule {}