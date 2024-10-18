import { computed, inject, Injectable, signal } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FilterItem } from '../models/filters/filter-item.model';
import { Filter } from '../models/filters/filter.model';
import { Banknote } from '../models/banknote.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private catalogService: CatalogService = inject(CatalogService);

  private readonly _appliedFilter = signal<Filter>({
    regionCode: '',
  });

  regionsFilter = computed<FilterItem[]>(() =>
    this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: this._appliedFilter().regionCode === r.code,
      highlighted: false,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: false,
        highlighted: false,
      })),
    }))
  );

  filteredBanknotes = computed<Banknote[]>(() => {
    if (this._appliedFilter().regionCode) {
      return this.catalogService
        .banknotes()
        .filter((b) => b.issuer.regionCode === this._appliedFilter().regionCode);
    }

    return this.catalogService.banknotes();
  });

  applyRegionFilter(selected: boolean, regionCode: string) {
    this._appliedFilter.set({ regionCode: selected ? regionCode : '' });
  }
}
