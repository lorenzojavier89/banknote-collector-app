import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'rarityIndex',
  standalone: true
})
export class RarityIndexPipe implements PipeTransform {
  private domSanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: number): SafeHtml {
    let count = 0;

    if (value >= 1 && value <= 25) {
      count = 1;
    } else if (value > 25 && value <= 50) {
      count = 2;
    } else if (value > 50 && value <= 75) {
      count = 3;
    } else if (value > 75 && value <= 100) {
      count = 4;
    }

    const badges = Array(count).fill('<span class="badge bg-primary me-1"> </span>').join('');
    return this.domSanitizer.bypassSecurityTrustHtml(badges);
  }

}
