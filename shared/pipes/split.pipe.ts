import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})

export class SplitPipe {
  transform(value: string, args: string) : string {
    return value.split(/(?=[A-Z])/).join(" ");
  }
}