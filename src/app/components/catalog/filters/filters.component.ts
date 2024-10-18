import { Component } from '@angular/core';
import { RegionsFilterPanelComponent } from "./regions-filter-panel/regions-filter-panel.component";
import { IssuersFilterPanelComponent } from './issuers-filter-panel/issuers-filter-panel.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [RegionsFilterPanelComponent, IssuersFilterPanelComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  
}
