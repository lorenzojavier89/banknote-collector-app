import { Component, computed, inject } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { FilterExpansionPanelComponent } from "./filter-expansion-panel/filter-expansion-panel.component";

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FilterExpansionPanelComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  private catalogService: CatalogService = inject(CatalogService);
  
  regions = this.catalogService.regions;
  issuers = computed(() => 
    Array.from(this.catalogService.issuers().values())
      .sort((a, b) => a.country.name.localeCompare(b.country.name)));

}
