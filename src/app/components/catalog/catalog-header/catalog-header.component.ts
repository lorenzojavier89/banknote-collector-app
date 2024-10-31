import { Component, computed, inject } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private filtersService: FiltersService = inject(FiltersService);

  filteredBanknotes = this.filtersService.filteredBanknotes;
  count = computed(() => this.filteredBanknotes().length);
}
