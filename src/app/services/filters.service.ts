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
  readonly appliedFilter = this._appliedFilter.asReadonly();

  constructor() {
    effect(() => {
      console.log(this._appliedFilter());
    });
  }

  regionsFilter = computed<FilterItem[]>(() =>{
    const { regionFilterCodes, subregionFilterCodes } = { ...this._appliedFilter() };

    return this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: regionFilterCodes().includes(r.code),
      highlighted: false,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: subregionFilterCodes().includes(sr.code),
        highlighted: false,
      })),
    }))
  });

  issuersFilter = computed<FilterItem[]>(() => {
    const { issuerFilterCode } = { ...this._appliedFilter() };

    return this.catalogService.issuers().map<FilterItem>(i => ({
      ...i.country,
      selected: issuerFilterCode() === i.country.code,
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
        const matchesRegion = appliedFilter.regionFilters && appliedFilter.regionFilterCodes().includes(b.issuer.regionCode);
        const matchesSubregion = appliedFilter.subregionFilters && appliedFilter.subregionFilterCodes().includes(b.issuer.subregionCode);
        const matchesCountry = appliedFilter.issuerFilter && appliedFilter.issuerFilterCode() === b.issuer.country.code;

        return matchesRegion || matchesSubregion || matchesCountry;
    });
  });

  applyRegionFilter(selected: boolean, clickedRegionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this._appliedFilter() };
    
    if(selected) {
      regionFilters.push(clickedRegionFilter);
      subregionFilters.push(...clickedRegionFilter.subItems || []);
    }
    else {
      regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code)
      subregionFilters = subregionFilters.filter(srf => !clickedRegionFilter.subItems?.map(i => i.code).includes(srf.code));
    }
    
    this._appliedFilter.set(new AppliedFilter(regionFilters, subregionFilters));
  }

  applySubregionFilter(selected: boolean, clickedRegionFilter: FilterItem, clickedSubregionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this._appliedFilter() };
    
    if(selected) {
      subregionFilters.push(clickedSubregionFilter);
    }
    else {
      regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code);
      subregionFilters = subregionFilters.filter(srf => srf.code != clickedSubregionFilter.code);
    }

    this._appliedFilter.set(new AppliedFilter(regionFilters, subregionFilters));
  }

  applyCountryFilter(selected: boolean, issuerFilterItem: FilterItem) {
    const issuerFilter = selected ? issuerFilterItem : null;
    
    this._appliedFilter.set(new AppliedFilter([], [], issuerFilter));
  }
}
