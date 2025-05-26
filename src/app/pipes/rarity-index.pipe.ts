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
      result = '<div style="white-space: nowrap; cursor: help;" title="Muy común">' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 9px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-light" style="margin-right: 1px; font-size: 10px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-light" style="margin-right: 1px; font-size: 11px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-light" style="margin-right: 1px; font-size: 13px; border: black 1px solid;"> </span></div>';
    } else if (value > 25 && value <= 50) {
      result = '<div style="white-space: nowrap; cursor: help;" title="Común">' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 9px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 10px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-light" style="margin-right: 1px; font-size: 11px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-light" style="margin-right: 1px; font-size: 13px; border: black 1px solid;"> </span></div>';
    } else if (value > 50 && value <= 75) {
      result = '<div style="white-space: nowrap; cursor: help;" title="Raro">' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 9px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 10px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 11px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-light" style="margin-right: 1px; font-size: 13px; border: black 1px solid;"> </span></div>';
    } else if (value > 75 && value <= 100) {
      result = '<div style="white-space: nowrap; cursor: help;" title="Muy raro">' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 9px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 10px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 11px; border: black 1px solid;"> </span>' +
        '<span class="badge bg-primary" style="margin-right: 1px; font-size: 13px; border: black 1px solid;"> </span></div>';
    }

    return this.domSanitizer.bypassSecurityTrustHtml(result);
  }

}
