import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { Volume } from '../../../../models/volume.enum';

@Component({
  selector: 'app-volumes-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent],
  templateUrl: './volumes-filter-panel.component.html',
  styleUrl: './volumes-filter-panel.component.scss'
})
export class VolumesFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  volumes = this.filtersService.volumes;

  badgeClass(code: string): string  {
    switch (code as Volume) {
      case Volume.Black: return 'text-bg-dark';
      case Volume.Red: return 'text-bg-danger';
      case Volume.Green: return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  }  

  applyVolumeFilter(selected: boolean, volumeFilterItem: FilterItem) {
    console.log(volumeFilterItem.name);
  }
}
