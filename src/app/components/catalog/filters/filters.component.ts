import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  private catalogService: CatalogService = inject(CatalogService);
  readonly panelOpenState = signal(false);

  regions = this.catalogService.regions;

}
