import { Component, computed, inject } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatCardModule, NgFor, NgIf],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private filtersService: FiltersService = inject(FiltersService);

  filteredBanknotes = this.filtersService.filteredBanknotes;
  appliedFilter = this.filtersService.appliedFilter;
  
  count = computed(() => this.filteredBanknotes().length);
}
