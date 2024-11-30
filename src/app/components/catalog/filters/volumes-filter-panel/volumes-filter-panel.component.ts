import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { VolumesService } from '../../../../services/volumes.service';

@Component({
  selector: 'app-volumes-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent],
  templateUrl: './volumes-filter-panel.component.html',
  styleUrl: './volumes-filter-panel.component.scss'
})
export class VolumesFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);
  private volumesService: VolumesService = inject(VolumesService);
  
  volumes = this.filtersService.volumes;

  badgeClass(code: string): string  {
    return this.volumesService.getBadgeClass(code);
  }  

  applyVolumeFilter(volumeFilterItem: FilterItem) {
    this.filtersService.applyVolumeFilter(volumeFilterItem);
  }
}
