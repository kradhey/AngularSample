import { Pipe, PipeTransform } from '@angular/core';
import { OrganizationList, AllowBadge } from '../../organization/models';
@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    
    transform(items: any[], filter: any): any {
        
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
      return items.filter(item => item.fullName.toLowerCase().indexOf(filter.toLowerCase()) != -1);
    }
}
