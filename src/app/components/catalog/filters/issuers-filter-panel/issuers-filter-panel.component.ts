import { Component, inject } from '@angular/core';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';
import { CatalogService } from '../../../../services/catalog.service';
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
  private catalogService: CatalogService = inject(CatalogService);
  
  issuers = this.catalogService.issuers;

  applyIssuerFilter(selected: boolean, issuerFilterItem: FilterItem) {
    this.catalogService.applyIssuerFilter(selected, issuerFilterItem);
  }
}
