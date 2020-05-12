import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchResolverService } from './search-resolver.service';
import { SearchComponent } from './search.component';

const routes: Routes = [
    { path: '', component: SearchComponent, resolve: { page: SearchResolverService }, }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  providers: [ SearchResolverService ]
})
export class SearchRoutingModule {}