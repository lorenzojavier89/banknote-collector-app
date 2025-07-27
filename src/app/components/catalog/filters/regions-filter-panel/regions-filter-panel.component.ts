import { Component, inject } from '@angular/core';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { Region } from '../../../../models/region.model';
import { Subregion } from '../../../../models/subregion.model';
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

  applyRegionFilter(ev: MouseEvent, region: Region) {
    const selected = (ev.target as HTMLInputElement).checked;
    if(!selected) {
      this.catalogService.removeRegion(region);
      return;
    }
    
    if(ev.ctrlKey) {
      this.catalogService.addAnotherRegion(region);
    } else {
      this.catalogService.changeRegion(region); 
    }
  }

  applySubregionFilter(ev: MouseEvent, region: Region, subregion: Subregion) {
    const selected = (ev.target as HTMLInputElement).checked;
    if(!selected) {
      this.catalogService.removeSubregion(region, subregion);
      return;
    }

    if(ev.ctrlKey) {
      this.catalogService.addAnotherSubregion(subregion);
    } else {
      this.catalogService.changeSubregion(subregion);
    }
  }

  isActive(region: Region): boolean {
    return !!region.selected;
  }

  isPartiallyActive(region: Region): boolean {
    return !!(!region.selected && region.subregions?.some(sr => sr.selected));
  }

  isDisabled(item: FilterItem): boolean {
    return item.counter === 0;
  }
}
