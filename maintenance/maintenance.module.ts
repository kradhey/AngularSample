import { CommonModule } from "@angular/common";
import { MaintenanceComponent } from "./maintenance.component";
import { NgModule } from "@angular/core";
import { MaintenanceRoutingModule } from "./maintenance-routing.module";

@NgModule({
    imports: [ 
        CommonModule,
        MaintenanceRoutingModule
    ],
    declarations: [
        MaintenanceComponent
    ],
    exports: [ 
        MaintenanceComponent 
    ],
    providers: [
    ]
})
export class MaintenanceModule {}