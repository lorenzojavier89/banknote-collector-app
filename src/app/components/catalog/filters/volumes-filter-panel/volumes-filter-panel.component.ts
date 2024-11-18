import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { NgFor } from '@angular/common';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';

@Component({
  selector: 'app-volumes-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, NgFor],
  templateUrl: './volumes-filter-panel.component.html',
  styleUrl: './volumes-filter-panel.component.scss'
})
export class VolumesFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  volumes = this.filtersService.volumes;

  applyVolumeFilter(selected: boolean, volumeFilterItem: FilterItem) {
    console.log(volumeFilterItem.name);
  }
}
