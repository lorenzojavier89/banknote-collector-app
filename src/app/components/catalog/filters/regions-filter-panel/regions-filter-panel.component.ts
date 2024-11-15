import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';

@Component({
  selector: 'app-regions-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent],
  templateUrl: './regions-filter-panel.component.html',
  styleUrl: './regions-filter-panel.component.scss'
})
export class RegionsFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);

  regions = this.filtersService.regions;

  applyRegionFilter(ev: Event, regionFilterItem: FilterItem) {
    const selected = (ev.target as HTMLInputElement).checked;
    this.filtersService.applyRegionFilter(selected, regionFilterItem);
  }

  applySubregionFilter(ev: Event, regionFilterItem: FilterItem, subregionFilterItem: FilterItem) {
    const selected = (ev.target as HTMLInputElement).checked;
    this.filtersService.applySubregionFilter(selected, regionFilterItem, subregionFilterItem);
  }

  isActive(regionFilterItem: FilterItem): boolean {
    return !!regionFilterItem.selected;
  }

  isPartiallyActive(regionFilterItem: FilterItem): boolean {
    return !!(!regionFilterItem.selected && regionFilterItem.subItems?.some(si => si.selected));
  }

  isDisabled(filterItem: FilterItem): boolean {
    return filterItem.counter === 0;
  }
}
