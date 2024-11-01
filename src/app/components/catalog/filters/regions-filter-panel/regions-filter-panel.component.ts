import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';

@Component({
  selector: 'app-regions-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, MatCheckboxModule],
  templateUrl: './regions-filter-panel.component.html',
  styleUrl: './regions-filter-panel.component.scss'
})
export class RegionsFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);

  regionsFilter = this.filtersService.regionsFilter;

  applyRegionFilter(selected: boolean, regionFilterItem: FilterItem) {
    this.filtersService.applyRegionFilter(selected, regionFilterItem);
  }

  applySubregionFilter(selected: boolean, regionFilterItem: FilterItem, subregionFilterItem: FilterItem) {
    this.filtersService.applySubregionFilter(selected, regionFilterItem, subregionFilterItem);
  }
}
