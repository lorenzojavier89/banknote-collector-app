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
    regionCodes: [],
    subregionCodes: [],
    countryCode: ''
  });

  constructor() {
    effect(() => {
      console.log(this._appliedFilter());
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

    return banknotes.filter((b) => {
        const matchesRegion = appliedFilter.regionCodes && appliedFilter.regionCodes.includes(b.issuer.regionCode);
        const matchesSubregion = appliedFilter.subregionCodes && appliedFilter.subregionCodes.includes(b.issuer.subregionCode);
        const matchesCountry = appliedFilter.countryCode && appliedFilter.countryCode === b.issuer.country.code;

        return matchesRegion || matchesSubregion || matchesCountry;
    });
  });

  applyRegionFilter(selected: boolean, regionCode: string, subregionCodes: string[]) {
    let rCodesResult = this._appliedFilter().regionCodes;
    let srCodesResult = this._appliedFilter().subregionCodes;
    
    if(selected) {
      rCodesResult.push(regionCode);
      srCodesResult.push(...subregionCodes);
    }
    else {
      rCodesResult = rCodesResult.filter(rCode => rCode != regionCode)
      srCodesResult = srCodesResult.filter(srCode => !subregionCodes.includes(srCode));
    }
    
    this._appliedFilter.set({ 
      regionCodes: [...new Set(rCodesResult)],
      subregionCodes: [...new Set(srCodesResult)],
      countryCode: '' 
    });
  }

  applySubregionFilter(selected: boolean, regionCode: string, subregionCode: string) {
    let rCodesResult = this._appliedFilter().regionCodes;
    let srCodesResult = this._appliedFilter().subregionCodes;
    
    if(selected) {
      srCodesResult.push(subregionCode);
    }
    else {
      rCodesResult = rCodesResult.filter(rCode => rCode != regionCode);
      srCodesResult = srCodesResult.filter(srCode => srCode != subregionCode);
    }

    this._appliedFilter.set({ 
      regionCodes: [...new Set(rCodesResult)],
      subregionCodes: [...new Set(srCodesResult)],
      countryCode: '' 
    });
  }

  applyCountryFilter(selected: boolean, code: string) {
    const countryCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCodes: [],
      subregionCodes: [],
      countryCode 
    });
  }
}
