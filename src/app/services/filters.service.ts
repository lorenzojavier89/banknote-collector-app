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

  private readonly _appliedFilter = signal<AppliedFilter>(new AppliedFilter());

  constructor() {
    effect(() => {
      console.log(this._appliedFilter().anyFilterApplied());
    });
  }

  regionsFilter = computed<FilterItem[]>(() =>{
    const { regionCodes, subregionCodes } = { ...this._appliedFilter() };

    return this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: regionCodes.includes(r.code),
      highlighted: false,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: subregionCodes.includes(sr.code),
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

    if(!appliedFilter.anyFilterApplied()) {
      return banknotes;
    }

    return banknotes.filter((b) => {
        const matchesRegion = appliedFilter.regionCodes && appliedFilter.regionCodes.includes(b.issuer.regionCode);
        const matchesSubregion = appliedFilter.subregionCodes && appliedFilter.subregionCodes.includes(b.issuer.subregionCode);
        const matchesCountry = appliedFilter.countryCode && appliedFilter.countryCode === b.issuer.country.code;

        return matchesRegion || matchesSubregion || matchesCountry;
    });
  });

  applyRegionFilter(selected: boolean, regionFilterCode: string, subregionFilterCodes: string[]) {
    let { regionCodes, subregionCodes } = { ...this._appliedFilter() };
    
    if(selected) {
      regionCodes.push(regionFilterCode);
      subregionCodes.push(...subregionFilterCodes);
    }
    else {
      regionCodes = regionCodes.filter(rCode => rCode != regionFilterCode)
      subregionCodes = subregionCodes.filter(srCode => !subregionFilterCodes.includes(srCode));
    }
    
    this._appliedFilter.set(new AppliedFilter(regionCodes, subregionCodes));
  }

  applySubregionFilter(selected: boolean, regionFilterCode: string, subregionFilterCode: string) {
    let { regionCodes, subregionCodes } = { ...this._appliedFilter() };
    
    if(selected) {
      subregionCodes.push(subregionFilterCode);
    }
    else {
      regionCodes = regionCodes.filter(rCode => rCode != regionFilterCode);
      subregionCodes = subregionCodes.filter(srCode => srCode != subregionFilterCode);
    }

    this._appliedFilter.set(new AppliedFilter(regionCodes, subregionCodes));
  }

  applyCountryFilter(selected: boolean, code: string) {
    const countryCode = selected ? code : '';
    
    this._appliedFilter.set(new AppliedFilter([], [], countryCode));
  }
}
