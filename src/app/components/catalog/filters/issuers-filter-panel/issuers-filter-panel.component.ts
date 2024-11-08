import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';

@Component({
  selector: 'app-issuers-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, MatCheckboxModule],
  templateUrl: './issuers-filter-panel.component.html',
  styleUrl: './issuers-filter-panel.component.scss'
})
export class IssuersFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  issuers = this.filtersService.issuers;

  applyCountryFilter(selected: boolean, issuerFilterItem: FilterItem) {
    this.filtersService.applyCountryFilter(selected, issuerFilterItem);
  }
}
