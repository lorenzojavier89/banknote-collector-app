import { Component, computed, inject } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, NgFor, NgIf],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private filtersService: FiltersService = inject(FiltersService);

  filteredBanknotes = this.filtersService.filteredBanknotes;
  appliedFilter = this.filtersService.appliedFilter;
  
  count = computed(() => this.filteredBanknotes().length);
}
