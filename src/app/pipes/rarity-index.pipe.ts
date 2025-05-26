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
      result = this.generateBadgeHtml(`Muy común (${value})`, 1, 3);
    } else if (value > 25 && value <= 50) {
      result = this.generateBadgeHtml(`Común (${value})`, 2, 2);
    } else if (value > 50 && value <= 75) {
      result = this.generateBadgeHtml(`Raro (${value})`, 3, 1);
    } else if (value > 75 && value <= 100) {
      result = this.generateBadgeHtml(`Muy raro (${value})`, 4, 0);
    }

    return this.domSanitizer.bypassSecurityTrustHtml(result);
  }

  private generateBadgeHtml(title: string, filled: number, empty: number): string {
    const badgeSizes = [9, 10, 11, 13];
    let badges = '';

    for (let i = 0; i < filled; i++) {
      badges += `<span class="badge bg-primary" style="margin-right: 1px; font-size: ${badgeSizes[i]}px; border: black 1px solid;"> </span>`;
    }
    for (let i = 0; i < empty; i++) {
      badges += `<span class="badge bg-light" style="margin-right: 1px; font-size: ${badgeSizes[filled + i]}px; border: black 1px solid;"> </span>`;
    }

    return `<div style="white-space: nowrap; cursor: help;" title="${title}">${badges}</div>`;
  }

}
