import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FiltersService } from '../../../../services/filters.service';

@Component({
  selector: 'app-issuers-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, MatCheckboxModule],
  templateUrl: './issuers-filter-panel.component.html',
  styleUrl: './issuers-filter-panel.component.scss'
})
export class IssuersFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  issuersFilter = this.filtersService.issuersFilter;

  applyCountryFilter(selected: boolean, code: string) {
    this.filtersService.applyCountryFilter(selected, code);
  }
}
