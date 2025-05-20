import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'rarityIndex',
  standalone: true
})
export class RarityIndexPipe implements PipeTransform {
  private domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: number): SafeHtml {
    let result = '';

    if (value >= 1 && value <= 25) {
      result = '<div><span class="badge bg-primary" style="margin-right: 1px; font-size: 10px;""> </span></div>';
    } else if (value > 25 && value <= 50) {
      result = '<div><span class="badge bg-primary" style="margin-right: 1px; font-size: 10px;""> </span>' + 
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 11px;""> </span></div>';
    } else if (value > 50 && value <= 75) {
      result = '<div><span class="badge bg-primary" style="margin-right: 1px; font-size: 10px;""> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 11px;""> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 13px;""> </span></div>';
    } else if (value > 75 && value <= 100) {
      result = '<div><span class="badge bg-primary" style="margin-right: 1px; font-size: 10px;""> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 11px;""> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 13px;""> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 14px;""> </span></div>';
    }

    // const badges = Array(count).fill('<span class="badge bg-primary me-1"> </span>').join('');
    return this.domSanitizer.bypassSecurityTrustHtml(result);
  }

}
