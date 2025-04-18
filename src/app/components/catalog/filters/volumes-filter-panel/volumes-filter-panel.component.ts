import { Component, inject } from '@angular/core';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { CatalogService } from '../../../../services/catalog.service';
import { VolumesService } from '../../../../services/volumes.service';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';

@Component({
  selector: 'app-volumes-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent],
  templateUrl: './volumes-filter-panel.component.html',
  styleUrl: './volumes-filter-panel.component.scss'
})
export class VolumesFilterPanelComponent {
  private catalogService: CatalogService = inject(CatalogService);
  private volumesService: VolumesService = inject(VolumesService);
  
  volumes = this.catalogService.volumes;

  badgeClass(code: string): string  {
    return this.volumesService.getBadgeClass(code);
  }  

  applyVolumeFilter(volumeFilterItem: FilterItem) {
    this.catalogService.changeVolume(volumeFilterItem);
  }
}
