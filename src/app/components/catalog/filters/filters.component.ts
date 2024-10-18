import { Component, inject } from '@angular/core';
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
  private filtersService: FiltersService = inject(FiltersService);
  
  regionsFilter = this.filtersService.regionsFilter;
  issuersFilter = this.filtersService.issuersFilter;

  applyRegionFilter(selected: boolean, code: string) {
    this.filtersService.applyRegionFilter(selected, code);
  }

  applySubregionFilter(selected: boolean, code: string) {
    this.filtersService.applySubregionFilter(selected, code);
  }

  applyCountryFilter(selected: boolean, code: string) {
    this.filtersService.applyCountryFilter(selected, code);
  }
}
