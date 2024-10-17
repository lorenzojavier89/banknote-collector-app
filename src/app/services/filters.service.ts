import { computed, inject, Injectable } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FilterItem } from '../models/filters/filter-item.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private catalogService: CatalogService = inject(CatalogService);

  regionsFilter = computed<FilterItem[]>(() =>
    this.catalogService.regions().map<FilterItem>((r) => ({
      selected: false,
      highlighted: false,
      code: r.code,
      name: r.name,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        selected: false,
        highlighted: false,
        code: sr.code,
        name: sr.name
      })),
    }))
  );
}
