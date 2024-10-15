import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { FiltersComponent } from "./filters/filters.component";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, FiltersComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private catalogService: CatalogService = inject(CatalogService);
  banknotes = this.catalogService.banknotes;
  regions = this.catalogService.regions;

  count = computed(() => this.banknotes().length);
}
