import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VolumeDetails } from '../../../../models/volume-details.model';
import { CatalogService } from '../../../../services/catalog.service';
import { VolumesService } from '../../../../services/volumes.service';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';

@Component({
  selector: 'app-volumes-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, NgFor],
  templateUrl: './volumes-filter-panel.component.html',
  styleUrl: './volumes-filter-panel.component.scss'
})
export class VolumesFilterPanelComponent {
  private catalogService: CatalogService = inject(CatalogService);
  private volumesService: VolumesService = inject(VolumesService);
  
  volumes = this.catalogService.volumes;

  badgeClass(name: string): string  {
    return this.volumesService.getBadgeClass(name);
  }  

  applyVolumeFilter(volume: VolumeDetails) {
    this.catalogService.changeVolume(volume);
  }
}
