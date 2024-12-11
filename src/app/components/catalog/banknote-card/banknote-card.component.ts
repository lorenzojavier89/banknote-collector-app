import { AfterViewInit, Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote } from '../../../models/banknote.model';
import { ImageLoaderComponent } from "../../utils/image-loader/image-loader.component";
import { NgFor } from '@angular/common';
import { Orientation } from '../../../models/orientation.enum';
import { BanknoteVCardComponent } from './banknote-vcard/banknote-vcard.component';
import { VolumesService } from '../../../services/volumes.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-banknote-card',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatTooltipModule, BanknoteVCardComponent, ImageLoaderComponent, NgFor],
  templateUrl: './banknote-card.component.html',
  styleUrl: './banknote-card.component.scss',
})
export class BanknoteCardComponent implements AfterViewInit {
  private volumesService: VolumesService = inject(VolumesService);
  private cardCommentEl = viewChild<ElementRef<HTMLElement>>('cardComment');
  
  banknote = input.required<Banknote>();
  collapsible = signal<boolean>(false);
  collapsed = signal<boolean>(true);
  regularDisplay = computed<boolean>(() => {
    return this.banknote().orientation === Orientation.Horizontal;
  });
  badgeClass = computed<string>(() => { 
    return this.volumesService.getBadgeClass(this.banknote().volume);
  }); 

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
