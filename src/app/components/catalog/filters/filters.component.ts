import { Component, computed, inject } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { FilterExpansionPanelComponent } from "./filter-expansion-panel/filter-expansion-panel.component";
import { FiltersService } from '../../../services/filters.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FilterExpansionPanelComponent, MatCheckboxModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  private catalogService: CatalogService = inject(CatalogService);
  private filtersService: FiltersService = inject(FiltersService);
  
  regionsFilter = this.filtersService.regionsFilter;
  issuers = computed(() => 
    Array.from(this.catalogService.issuers().values())
      .sort((a, b) => a.country.name.localeCompare(b.country.name)));

  applyRegionFilter(selected: boolean, regionCode: string) {
    this.filtersService.applyRegionFilter(selected, regionCode);
  }
}
