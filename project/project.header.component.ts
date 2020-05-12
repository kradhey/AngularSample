import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteHeaderComponent } from 'shared/components/site-header/site-header.component';

@Component({
    selector: 'ij-project-header',
    templateUrl: './project.header.component.html'
})
export class ProjectHeaderComponent {
    @ViewChild("siteHeader") siteHeader: SiteHeaderComponent;
    constructor() { }
}
