import { Component, computed, inject, signal } from '@angular/core';
import { FiltersComponent } from "./filters/filters.component";
import { FiltersService } from '../../services/filters.service';
import { BanknoteCardComponent } from './banknote-card/banknote-card.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor } from '@angular/common';
import { CatalogHeaderComponent } from "./catalog-header/catalog-header.component";
import { CatalogViewMode } from '../../models/catalog-view-mode.enum';
import { CatalogTableComponent } from './catalog-table/catalog-table.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [BanknoteCardComponent, FiltersComponent, NgFor, CatalogHeaderComponent, CatalogTableComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({opacity: 0}), animate('1s', style({opacity: 1}))]),
      transition(':leave', [animate('250ms', style({opacity: 0}))]),
    ]),
  ]
})
export class CatalogComponent {
  private filtersService: FiltersService = inject(FiltersService);

  viewMode = signal<CatalogViewMode>(CatalogViewMode.GridView);
  displayGridViewMode = computed(() => this.viewMode() === CatalogViewMode.GridView);

  banknotes = this.filtersService.banknotes;
}
