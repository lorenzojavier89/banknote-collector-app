import { Component, computed, inject } from '@angular/core';
import { FiltersComponent } from "./filters/filters.component";
import { FiltersService } from '../../services/filters.service';
import { BanknoteCardComponent } from './banknote-card/banknote-card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [BanknoteCardComponent, FiltersComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  filteredBanknotes = this.filtersService.filteredBanknotes;
  count = computed(() => this.filteredBanknotes().length);
}
