import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FiltersService } from '../../../../services/filters.service';

@Component({
  selector: 'app-regions-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, MatCheckboxModule],
  templateUrl: './regions-filter-panel.component.html',
  styleUrl: './regions-filter-panel.component.scss'
})
export class RegionsFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);

  regionsFilter = this.filtersService.regionsFilter;

  applyRegionFilter(selected: boolean, code: string) {
    this.filtersService.applyRegionFilter(selected, code);
  }

  applySubregionFilter(selected: boolean, code: string) {
    this.filtersService.applySubregionFilter(selected, code);
  }
}
