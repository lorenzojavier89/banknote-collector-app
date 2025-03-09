import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { CatalogService } from '../../../../services/catalog.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';

@Component({
  selector: 'app-regions-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent],
  templateUrl: './regions-filter-panel.component.html',
  styleUrl: './regions-filter-panel.component.scss'
})
export class RegionsFilterPanelComponent {
  private catalogService: CatalogService = inject(CatalogService);

  regions = this.catalogService.regions;

  applyRegionFilter(ev: Event, regionFilterItem: FilterItem) {
    const selected = (ev.target as HTMLInputElement).checked;
    this.catalogService.applyRegionFilter(selected, regionFilterItem);
  }

  applySubregionFilter(ev: Event, regionFilterItem: FilterItem, subregionFilterItem: FilterItem) {
    const selected = (ev.target as HTMLInputElement).checked;
    this.catalogService.applySubregionFilter(selected, regionFilterItem, subregionFilterItem);
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
