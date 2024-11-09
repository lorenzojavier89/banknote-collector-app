import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { FiltersService } from '../../../../services/filters.service';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-issuers-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, NgFor],
  templateUrl: './issuers-filter-panel.component.html',
  styleUrl: './issuers-filter-panel.component.scss'
})
export class IssuersFilterPanelComponent {
  private filtersService: FiltersService = inject(FiltersService);
  
  issuers = this.filtersService.issuers;

  applyIssuerFilter(selected: boolean, issuerFilterItem: FilterItem) {
    this.filtersService.applyIssuerFilter(selected, issuerFilterItem);
  }
}
