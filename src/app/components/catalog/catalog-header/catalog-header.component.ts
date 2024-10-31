import { Component, computed, inject } from '@angular/core';
import { FiltersService } from '../../../services/filters.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-catalog-header',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './catalog-header.component.html',
  styleUrl: './catalog-header.component.scss'
})
export class CatalogHeaderComponent {
  private filtersService: FiltersService = inject(FiltersService);

  filteredBanknotes = this.filtersService.filteredBanknotes;
  count = computed(() => this.filteredBanknotes().length);
}
