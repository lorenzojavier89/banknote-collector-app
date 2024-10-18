import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiltersComponent } from "./filters/filters.component";
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, FiltersComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  filteredBanknotes = this.filtersService.filteredBanknotes;
  count = computed(() => this.filteredBanknotes().length);
}
