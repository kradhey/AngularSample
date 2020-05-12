import { AbstractControl, ValidatorFn, NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { utils } from '../view/video';

function videoUrlValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        if (!control.value) {
          return null;
        }

        let res = utils.parseVideo(control.value || '');
        
        if (res.type === 'youtube' || res.type === 'vimeo') {
            return null;
        }
        
        return {
            'ij-video-url': {value: control.value}
        };
    };
  }

  @Directive({
    selector: '[ij-video-url]',
    providers: [{provide: NG_VALIDATORS, useExisting: VideoUrlValidatorDirective, multi: true}]
  })
  export class VideoUrlValidatorDirective implements Validator {
    @Input('ij-video-url') videoUrl: string;
   
    validate(control: AbstractControl): {[key: string]: any} {
      return videoUrlValidator(new RegExp(this.videoUrl, 'i'))(control);
    }
  }