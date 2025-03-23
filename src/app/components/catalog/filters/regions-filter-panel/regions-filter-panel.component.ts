import { Component, inject } from '@angular/core';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { CatalogService } from '../../../../services/catalog.service';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';

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

  applyRegionFilter(ev: MouseEvent, regionFilterItem: FilterItem) {
    const selected = (ev.target as HTMLInputElement).checked;
    if(!selected) {
      this.catalogService.removeRegionFilter(regionFilterItem);
      return;
    }
    
    if(ev.ctrlKey) {
      this.catalogService.appendRegionFilter(regionFilterItem);
    } else {
      this.catalogService.replaceRegionFilter(regionFilterItem); 
    }
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
