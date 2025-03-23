import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FilterItem } from '../../../../models/filters/filter-item.model';
import { CatalogService } from '../../../../services/catalog.service';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';

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
    this.catalogService.changeIssuer(selected, issuerFilterItem);
  }
}
