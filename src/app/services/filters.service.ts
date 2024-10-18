import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FilterItem } from '../models/filters/filter-item.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { Banknote } from '../models/banknote.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private catalogService: CatalogService = inject(CatalogService);

  private readonly _appliedFilter = signal<AppliedFilter>({
    regionCode: '',
    subregionCode: '',
    countryCode: ''
  });

  constructor() {
    effect(() => {
      console.log(this._appliedFilter());
    });
  }

  regionsFilter = computed<FilterItem[]>(() =>{
    const { regionCode, subregionCode } = { ...this._appliedFilter() };

    return this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: regionCode === r.code,
      highlighted: false,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: subregionCode === sr.code,
        highlighted: false,
      })),
    }))
  });

  issuersFilter = computed<FilterItem[]>(() => {
    const { countryCode } = { ...this._appliedFilter() };

    return this.catalogService.issuers().map<FilterItem>(i => ({
      ...i.country,
      selected: countryCode === i.country.code,
      highlighted: false
    }))
  });

  filteredBanknotes = computed<Banknote[]>(() => {
    const appliedFilter = this._appliedFilter();
    const banknotes = this.catalogService.banknotes();

    return banknotes.filter((b) => {
        const matchesRegion = !appliedFilter.regionCode || b.issuer.regionCode === appliedFilter.regionCode;
        const matchesSubregion = !appliedFilter.subregionCode || b.issuer.subregionCode === appliedFilter.subregionCode;
        const matchesCountry = !appliedFilter.countryCode || b.issuer.country.code === appliedFilter.countryCode;

        return matchesRegion && matchesSubregion && matchesCountry;
    });
  });

  applyRegionFilter(selected: boolean, code: string) {
    const regionCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCode,
      subregionCode: '',
      countryCode: '' 
    });
  }

  applySubregionFilter(selected: boolean, code: string) {
    const subregionCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCode: '',
      subregionCode,
      countryCode: '' 
    });
  }

  applyCountryFilter(selected: boolean, code: string) {
    const countryCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCode: '',
      subregionCode: '',
      countryCode 
    });
  }
}
