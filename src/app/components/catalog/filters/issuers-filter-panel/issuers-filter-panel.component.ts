import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Country } from '../../../../models/country.model';
import { CatalogService } from '../../../../services/catalog.service';
import { FilterExpansionPanelComponent } from '../filter-expansion-panel/filter-expansion-panel.component';

@Component({
  selector: 'app-issuers-filter-panel',
  standalone: true,
  imports: [FilterExpansionPanelComponent, NgFor, MatTooltipModule],
  templateUrl: './issuers-filter-panel.component.html',
  styleUrl: './issuers-filter-panel.component.scss'
})
export class IssuersFilterPanelComponent {
  private catalogService: CatalogService = inject(CatalogService);
  
  countries = this.catalogService.countries;

  applyIssuerFilter(selected: boolean, issuer: Country) {
    this.catalogService.changeIssuer(selected, issuer);
  }

  getIssuerTooltip(issuer: Country): string {
    const historicalPeriods = issuer.historicalPeriods?.map(si => si.name) || [];
    const subgroups = issuer.subgroups?.map(sg => sg.name) || [];
    return [...historicalPeriods, ...subgroups].join("\n");
  }
}
