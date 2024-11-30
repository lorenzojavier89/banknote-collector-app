import { AfterViewInit, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote } from '../../../models/banknote.model';
import { ImageLoaderComponent } from "../../utils/image-loader/image-loader.component";
import { NgFor } from '@angular/common';
import { Volume } from '../../../models/volume.enum';
import { Orientation } from '../../../models/orientation.enum';
import { BanknoteVCardComponent } from './banknote-vcard/banknote-vcard.component';

@Component({
  selector: 'app-banknote-card',
  standalone: true,
  imports: [RouterLink, BanknoteVCardComponent, ImageLoaderComponent, NgFor],
  templateUrl: './banknote-card.component.html',
  styleUrl: './banknote-card.component.scss',
})
export class BanknoteCardComponent implements AfterViewInit {
  banknote = input.required<Banknote>();
  private cardCommentEl = viewChild<ElementRef<HTMLElement>>('cardComment');
  collapsible = signal<boolean>(false);
  collapsed = signal<boolean>(true);

  regularDisplay = computed<boolean>(() => {
    return this.banknote().orientation === Orientation.Horizontal;
  });

  badgeClass = computed<string>(() => {
    switch (this.banknote().volume) {
      case Volume.Black: return 'text-bg-dark';
      case Volume.Red: return 'text-bg-danger';
      case Volume.Green: return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  })  

  ngAfterViewInit(): void {
    const element = this.cardCommentEl()?.nativeElement;
    const collapsible = !!element && element.scrollHeight > element.clientHeight;
    this.collapsible.set(collapsible);
  }
    
  onCommentClick() {
    if(this.collapsible()){
      this.collapsed.set(!this.collapsed());
    }
  }
}
