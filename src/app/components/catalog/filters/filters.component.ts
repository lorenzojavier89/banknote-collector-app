import { Component } from '@angular/core';
import { RegionsFilterPanelComponent } from "./regions-filter-panel/regions-filter-panel.component";
import { IssuersFilterPanelComponent } from './issuers-filter-panel/issuers-filter-panel.component';
import { VolumesFilterPanelComponent } from "./volumes-filter-panel/volumes-filter-panel.component";

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [RegionsFilterPanelComponent, IssuersFilterPanelComponent, VolumesFilterPanelComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  
}
