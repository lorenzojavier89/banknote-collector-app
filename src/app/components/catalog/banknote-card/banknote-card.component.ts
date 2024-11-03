import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote } from '../../../models/banknote.model';
import { ImageLoaderComponent } from "../../utils/image-loader/image-loader.component";

@Component({
  selector: 'app-banknote-card',
  standalone: true,
  imports: [RouterLink, ImageLoaderComponent],
  templateUrl: './banknote-card.component.html',
  styleUrl: './banknote-card.component.scss',
})
export class BanknoteCardComponent implements AfterViewInit {
  banknote = input.required<Banknote>();
  private cardCommentEl = viewChild<ElementRef<HTMLElement>>('cardComment');
  overflowed = signal<boolean>(false);

  ngAfterViewInit(): void {
    const element = this.cardCommentEl()?.nativeElement;
    const overflowed = !!element && element.scrollHeight > element.clientHeight;
    this.overflowed.set(overflowed);
  }
    
  onCommentClick() {
    this.overflowed.set(!this.overflowed());
  }

}
